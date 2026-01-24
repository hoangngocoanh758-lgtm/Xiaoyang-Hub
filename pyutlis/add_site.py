import os
import time
import json
import sys
import hashlib
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from google import genai
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path
try:
    import boto3
except Exception:
    boto3 = None

load_dotenv(Path(__file__).resolve().parent / ".env.local")


def prompt_value(label, default_value=None):
    # 统一的交互输入封装
    prompt_text = f"{label}"
    if default_value:
        prompt_text = f"{label}（直接回车使用默认：{default_value}）"
    value = input(f"{prompt_text}: ").strip()
    return value or default_value


def require_value(env_name, label, guide):
    # 读取环境变量，不存在时提示用户输入
    value = os.getenv(env_name)
    if value:
        return value
    value = input(f"{label}: ").strip()
    if value:
        return value
    print(f"❌ 缺少 {env_name}")
    print(guide)
    raise SystemExit(1)


DB_URL = os.getenv("DB_URL") or os.getenv("SUPABASE_URL") or os.getenv("VUE_APP_SUPABASE_URL")
if not DB_URL:
    DB_URL = prompt_value("请输入 Supabase 项目 URL（Project Settings -> API -> Project URL）")
    if not DB_URL:
        raise SystemExit("❌ Supabase 项目 URL 不能为空")

# 数据库写入密钥
DB_KEY = require_value(
    "DB_KEY",
    "请输入 Supabase DB Key",
    "配置位置：Supabase 控制台 -> Project Settings -> API -> service_role secret",
)
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("DB_SERVICE_ROLE_KEY")
# Gemini 配置
GEMINI_API_KEY = require_value(
    "GEMINI_API_KEY",
    "请输入 Gemini API Key",
    "配置位置：Google AI Studio -> API Keys",
)
GEMINI_MODEL = os.getenv("GEMINI_MODEL") or "gemini-flash-latest"

# Storage S3 配置
S3_ENDPOINT = require_value(
    "S3_ENDPOINT",
    "请输入 Supabase Storage S3 Endpoint",
    "配置位置：Supabase 控制台 -> Storage -> Settings",
)
ACCESS_KEY_ID = require_value(
    "ACCESS_KEY_ID",
    "请输入 S3 Access Key ID",
    "配置位置：Supabase 控制台 -> Storage -> Settings",
)
SECRET_ACCESS_KEY = require_value(
    "SECRET_ACCESS_KEY",
    "请输入 S3 Secret Access Key",
    "配置位置：Supabase 控制台 -> Storage -> Settings",
)

TABLE_NAME = os.getenv("TABLE_NAME") or "xy_navigation_items"
BUCKET_NAME = os.getenv("BUCKET_NAME") or "nav_icons"

# 优先使用 Service Role Key，避免 RLS 拦截
ACTIVE_DB_KEY = SERVICE_ROLE_KEY or DB_KEY
supabase: Client = create_client(DB_URL, ACTIVE_DB_KEY)
genai_client = genai.Client(api_key=GEMINI_API_KEY)

def build_prompt(url, head_content="", body_content="", url_only=False):
    # 生成模型提示词，支持仅 URL 推断或 HTML 解析
    if url_only:
        return f"""
You are a JSON extractor.
Based only on the URL and common site naming, infer the most likely info and return ONLY a JSON object:
{{
  "title": "Website Title",
  "description": "Short summary in Chinese (max 15 words)",
  "category": "Choose one: ['常用AI', 'B站运营', '设计与效率', '开发工具', '其他']",
  "icon_url": "Absolute URL of favicon if you can infer, otherwise empty string"
}}

URL:
{url}
"""
    return f"""
You are a JSON extractor.
Extract info from this HTML and return ONLY a JSON object:
{{
  "title": "Website Title",
  "description": "Short summary in Chinese (max 15 words)",
  "category": "Choose one: ['常用AI', 'B站运营', '设计与效率', '开发工具', '其他']",
  "icon_path": "URL of favicon (look for rel='icon', 'shortcut icon'). Return absolute URL if possible."
}}

HTML Context:
{head_content}
{body_content}
"""


def parse_ai_response(text, url):
    # 解析模型返回内容，补齐 icon_url
    if not text:
        return None
    data = extract_json(text)
    if not data:
        return None
    if not isinstance(data, dict):
        return None
    icon_url = data.get("icon_url")
    icon_path = data.get("icon_path")
    if icon_url:
        data["icon_url"] = icon_url
    elif icon_path:
        data["icon_url"] = urljoin(url, icon_path)
    else:
        data["icon_url"] = urljoin(url, "/favicon.ico")
    return data


def ai_extract(url, head_content="", body_content="", url_only=False):
    # 调用模型生成结构化信息
    prompt = build_prompt(url, head_content, body_content, url_only=url_only)
    res = genai_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return parse_ai_response(res.text, url)


def extract_json(text):
    # 兼容模型输出夹带说明文字的情况
    if not text:
        return None
    try:
        return json.loads(text)
    except Exception:
        pass
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    snippet = text[start : end + 1]
    try:
        return json.loads(snippet)
    except Exception:
        return None


def manual_input(url):
    # 手动兜底输入信息
    title = prompt_value("请输入网站标题")
    description = prompt_value("请输入中文简介（15字以内）") or ""
    category = prompt_value("请输入分类（常用AI/B站运营/设计与效率/开发工具/其他）") or "其他"
    if category not in ["常用AI", "B站运营", "设计与效率", "开发工具", "其他"]:
        category = "其他"
    icon_url = prompt_value("请输入图标 URL（可留空）")
    if not icon_url:
        icon_url = urljoin(url, "/favicon.ico")
    return {
        "title": title or "未命名",
        "description": description,
        "category": category,
        "icon_url": icon_url,
    }


def fetch_website_info(url):
    # 访问网页并尝试用 AI 解析
    print(f"1. 正在分析网站: {url} ...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.encoding = response.apparent_encoding
        html_content = response.text
    except Exception as e:
        print(f"⚠️ 访问失败: {e}")
        return fallback_info(url)

    soup = BeautifulSoup(html_content, 'html.parser')
    head_content = str(soup.head) if soup.head else ""
    body_content = str(soup.body)[:5000] if soup.body else ""

    try:
        info = ai_extract(url, head_content, body_content, url_only=False)
        if info:
            return info
    except Exception as e:
        print(f"⚠️ Gemini 解析失败: {e}")
    return fallback_info(url)


def fallback_info(url):
    # 访问失败或解析失败时的降级策略
    choice = prompt_value("访问失败或解析失败，选择模式 1=手动填写 2=仅用URL让AI猜测", "1")
    if choice == "2":
        try:
            info = ai_extract(url, url_only=True)
            if info:
                return info
        except Exception as e:
            print(f"⚠️ URL 推断失败: {e}")
    return manual_input(url)

def download_icon(icon_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': icon_url
    }
    try:
        r = requests.get(icon_url, headers=headers, timeout=12, allow_redirects=True)
        if r.status_code != 200 or not r.content:
            return None, None
        content_type = r.headers.get('content-type', 'image/png')
        return r.content, content_type
    except Exception:
        return None, None


def build_icon_candidates(icon_url, website_url):
    candidates = []
    if icon_url:
        candidates.append(icon_url)
    parsed = urlparse(website_url)
    base = f"{parsed.scheme}://{parsed.netloc}"
    candidates.extend([
        f"{base}/favicon.ico",
        f"{base}/favicon.png",
        f"{base}/apple-touch-icon.png",
        f"{base}/apple-touch-icon-precomposed.png"
    ])
    if parsed.netloc:
        candidates.append(f"https://www.google.com/s2/favicons?sz=128&domain_url={website_url}")
        candidates.append(f"https://icons.duckduckgo.com/ip3/{parsed.netloc}.ico")
    seen = set()
    unique = []
    for item in candidates:
        if item and item not in seen:
            unique.append(item)
            seen.add(item)
    return unique


def extract_svg(text):
    if not text:
        return None
    start = text.find("<svg")
    end = text.rfind("</svg>")
    if start == -1 or end == -1:
        return None
    return text[start:end + 6]


def build_fallback_svg(title, category):
    text = (title or "AI").strip()[:1].upper() or "A"
    palette = {
        "常用AI": "#6366F1",
        "B站运营": "#EC4899",
        "设计与效率": "#22C55E",
        "开发工具": "#0EA5E9",
        "其他": "#64748B"
    }
    color = palette.get(category or "其他", "#64748B")
    seed = hashlib.md5((title or category or "AI").encode("utf-8")).hexdigest()
    shade = int(seed[:2], 16)
    bg = f"#{min(255, shade + 80):02x}{min(255, shade + 60):02x}{min(255, shade + 40):02x}"
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">'
        f'<rect width="256" height="256" rx="48" fill="{bg}"/>'
        f'<circle cx="198" cy="58" r="20" fill="{color}"/>'
        f'<text x="50%" y="56%" text-anchor="middle" fill="#ffffff" font-size="120" font-family="Arial, sans-serif">{text}</text>'
        "</svg>"
    )


def generate_ai_svg(title, category):
    prompt = f"""
Generate a minimal SVG icon. Requirements:
- Return ONLY SVG markup, no code fences.
- Size 256x256, viewBox 0 0 256 256.
- Simple, flat style.
- Theme: {category}.
- Include a single letter from title: {title}.
"""
    res = genai_client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return extract_svg(res.text)


def upload_icon(icon_url, website_url, s3_client, title=None, category=None):
    candidates = build_icon_candidates(icon_url, website_url)
    content = None
    content_type = None
    if candidates:
        for candidate in candidates:
            print(f"2. 正在下载图标: {candidate} ...")
            content, content_type = download_icon(candidate)
            if content:
                break
    if not content:
        print("⚠️ 图标下载失败，尝试生成替代图标")
        svg = None
        try:
            svg = generate_ai_svg(title or "", category or "")
        except Exception:
            svg = None
        if not svg:
            svg = build_fallback_svg(title or "AI", category or "其他")
        content = svg.encode("utf-8")
        content_type = "image/svg+xml"

    ext = 'png'
    if content_type:
        if 'svg' in content_type:
            ext = 'svg'
        elif 'icon' in content_type or 'ico' in content_type:
            ext = 'ico'
        elif 'jpeg' in content_type or 'jpg' in content_type:
            ext = 'jpg'

    domain = urlparse(website_url).netloc.replace('.', '_')
    filename = f"{domain}_{int(time.time())}.{ext}"

    print(f"3. 正在上传到 Supabase Storage: {filename}")

    s3_client.put_object(
        Bucket=BUCKET_NAME,
        Key=filename,
        Body=content,
        ContentType=content_type or 'image/png',
    )
    public_url = f"{DB_URL}/storage/v1/object/public/{BUCKET_NAME}/{filename}"
    return public_url

def find_existing_record(original_url, title):
    # 先按 URL 查找，再按标题查找
    try:
        res = supabase.table(TABLE_NAME).select("id,title,url").eq("url", original_url).limit(1).execute()
        data = getattr(res, "data", None) or []
        if data:
            return data[0]
        if title:
            res = supabase.table(TABLE_NAME).select("id,title,url").eq("title", title).limit(1).execute()
            data = getattr(res, "data", None) or []
            if data:
                return data[0]
    except Exception as e:
        print(f"⚠️ 查询已有记录失败: {e}")
    return None


def save_to_db(data, icon_url, original_url):
    # 写库前先判断是否存在，存在则更新
    global supabase, ACTIVE_DB_KEY, SERVICE_ROLE_KEY
    print("4. 正在写入数据库...")
    payload = {
        "title": data.get('title', '未命名'),
        "url": original_url,
        "description": data.get('description', ''),
        "category": data.get('category', '其他'),
        "icon_url": icon_url,
        "sort_order": 50
    }
    
    existing = find_existing_record(original_url, payload["title"])

    def execute_write():
        # 根据是否存在记录选择更新或插入
        if existing:
            return supabase.table(TABLE_NAME).update(payload).eq("id", existing["id"]).execute()
        return supabase.table(TABLE_NAME).insert(payload).execute()

    try:
        execute_write()
        action = "更新" if existing else "入库"
        print(f"\n✅ 成功{action}！\n标题: {payload['title']}\n分类: {payload['category']}")
        return True
    except Exception as e:
        message = str(e)
        if "row-level security" in message or "42501" in message:
            if not SERVICE_ROLE_KEY:
                key = prompt_value("需要 Service Role Key 才能写入，输入后重试（可回车跳过）")
                if key:
                    SERVICE_ROLE_KEY = key
                    ACTIVE_DB_KEY = SERVICE_ROLE_KEY
                    supabase = create_client(DB_URL, ACTIVE_DB_KEY)
                    try:
                        execute_write()
                        action = "更新" if existing else "入库"
                        print(f"\n✅ 成功{action}！\n标题: {payload['title']}\n分类: {payload['category']}")
                        return True
                    except Exception as inner:
                        print(f"❌ 数据库写入失败: {inner}")
                        return False
        print(f"❌ 数据库写入失败: {e}")
        return False

if __name__ == "__main__":
    # 主流程入口
    if boto3 is None:
        raise SystemExit("❌ 缺少 boto3 依赖，请先安装后再运行")
    args = [arg for arg in sys.argv[1:] if arg]
    skip_upload = "--skip-upload" in args
    skip_db = "--skip-db" in args
    url_args = [arg for arg in args if not arg.startswith("--")]
    target = url_args[0] if url_args else ""
    if not target:
        target = input("请输入网址 (如 https://v0.dev): ").strip()
    if target:
        info = fetch_website_info(target)
        if info:
            final_icon = info.get("icon_url")
            if not skip_upload:
                s3_client = boto3.client(
                    "s3",
                    endpoint_url=S3_ENDPOINT,
                    aws_access_key_id=ACCESS_KEY_ID,
                    aws_secret_access_key=SECRET_ACCESS_KEY,
                )
                final_icon = upload_icon(info.get('icon_url'), target, s3_client, info.get("title"), info.get("category"))
            if skip_db:
                print("⚠️ 已跳过数据库写入")
            else:
                save_to_db(info, final_icon, target)
