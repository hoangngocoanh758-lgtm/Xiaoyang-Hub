function formatTime(seconds, type, timeOffset) {
  const totalSeconds = Math.max(0, parseFloat(seconds) + parseFloat(timeOffset || 0))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  const ms = Math.floor((totalSeconds % 1) * 1000)

  const hh = h.toString().padStart(2, '0')
  const mm = m.toString().padStart(2, '0')
  const ss = s.toString().padStart(2, '0')
  const mmm = ms.toString().padStart(3, '0')

  if (type === 'vtt') {
    return `${hh}:${mm}:${ss}.${mmm}`
  }
  return `${hh}:${mm}:${ss},${mmm}`
}

export function parseJson(inputJson) {
  let rawData
  try {
    rawData = JSON.parse(inputJson)
  } catch (e) {
    throw new Error('这不是有效的 JSON 格式。请确保复制了完整的响应内容（包含 { 和 }）。')
  }

  let body = null
  if (Array.isArray(rawData)) {
    body = rawData
  } else if (rawData.body && Array.isArray(rawData.body)) {
    body = rawData.body
  } else if (rawData.data && rawData.data.body && Array.isArray(rawData.data.body)) {
    body = rawData.data.body
  } else if (rawData.data && Array.isArray(rawData.data)) {
    body = rawData.data
  }

  if (!body || body.length === 0) {
    throw new Error("解析成功，但未找到字幕数据。请确认视频已开启 AI 字幕且您复制的是 'Response'。")
  }

  const first = body[0]
  const hasFrom = Object.prototype.hasOwnProperty.call(first, 'from')
  const hasContent = Object.prototype.hasOwnProperty.call(first, 'content')
  if (!hasFrom && !hasContent) {
    throw new Error("JSON 结构不匹配。找不到 'from' 或 'content' 字段。")
  }

  return body
}

export function buildPreview(subs, format, timeOffset) {
  const previewItems = subs.slice(0, 10)
  let text = ''
  previewItems.forEach((item, index) => {
    const start = item.from
    const end = item.to || item.from + item.content.length * 0.2 + 1

    if (format === 'txt') {
      text += `${item.content}\n`
    } else if (format === 'srt') {
      text += `${index + 1}\n`
      text += `${formatTime(start, 'srt', timeOffset)} --> ${formatTime(end, 'srt', timeOffset)}\n`
      text += `${item.content}\n\n`
    } else if (format === 'vtt') {
      if (index === 0) {
        text += 'WEBVTT\n\n'
      }
      text += `${formatTime(start, 'vtt', timeOffset)} --> ${formatTime(end, 'vtt', timeOffset)}\n`
      text += `${item.content}\n\n`
    }
  })

  if (subs.length > 10) {
    const rest = subs.length - 10
    text += `\n... (还有 ${rest} 行字幕)`
  }

  return text
}

export function buildFullText(subs, format, timeOffset) {
  let content = ''
  subs.forEach((item, index) => {
    const start = item.from
    const end = item.to || item.from + 2

    if (format === 'txt') {
      content += `${item.content}\n`
    } else if (format === 'srt') {
      content += `${index + 1}\n`
      content += `${formatTime(start, 'srt', timeOffset)} --> ${formatTime(
        end,
        'srt',
        timeOffset
      )}\n`
      content += `${item.content}\n\n`
    } else if (format === 'vtt') {
      if (index === 0) {
        content += 'WEBVTT\n\n'
      }
      content += `${formatTime(start, 'vtt', timeOffset)} --> ${formatTime(
        end,
        'vtt',
        timeOffset
      )}\n`
      content += `${item.content}\n\n`
    }
  })
  return content
}
