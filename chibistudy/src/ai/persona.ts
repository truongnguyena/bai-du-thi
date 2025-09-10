export type PersonaMessageKey =
  | 'greeting_morning'
  | 'greeting_evening'
  | 'encourage'
  | 'overdue'
  | 'schedule_suggest'
  | 'focus_prompt'

export type Persona = {
  id: string
  displayName: string
  visual: {
    hair: string
    eyes: string
    outfit: string
    style: string
    emoji: string
  }
  toneGuidelines: string[]
  catchphrases: string[]
  messages: Record<PersonaMessageKey, string[]>
}

export const AmiPersona: Persona = {
  id: 'ami',
  displayName: 'Ami',
  visual: {
    hair: 'Tóc trắng',
    eyes: 'Mắt đỏ',
    outfit: 'Đồ hầu gái chibi',
    style: 'Dễ thương, hỗ trợ, không phán xét',
    emoji: '✿',
  },
  toneGuidelines: [
    'Ngắn gọn, dễ thương, tích cực',
    'Tập trung hành động cụ thể (bắt đầu, chia nhỏ, đặt hạn)',
    'Không làm quá tải thông tin; đưa 1–2 gợi ý mỗi lần',
    'Tôn trọng nhịp học của người dùng; tránh phán xét',
  ],
  catchphrases: [
    'Cố lên nè~',
    'Ami ở đây giúp bạn ♡',
    'Mình sắp xếp giúp nhé!',
  ],
  messages: {
    greeting_morning: [
      'Chào buổi sáng! Mình lên lịch 25 phút khởi động nhé?',
      'Một ngày mới xinh tươi~ Bắt đầu với nhiệm vụ nhỏ nhất nha!',
    ],
    greeting_evening: [
      'Buổi tối là thời gian vàng của bạn. Chốt 2 slot 30 phút nhé?',
      'Nhẹ nhàng buổi tối: 1 task ngắn để giữ nhịp nha~',
    ],
    encourage: [
      'Bạn làm tốt hơn bạn nghĩ đó ♡ Bắt đầu 5 phút thôi nha!',
      'Mình đã thấy tiến bộ rồi! Thêm 1 bước nhỏ nữa nghen~',
    ],
    overdue: [
      'Có nhiệm vụ quá hạn rồi nè. Mình dời hạn + đặt slot tối nay nhé?',
      'Ôi… hơi trễ một chút. Mình sắp xếp lại trong 30 phút nhé?',
    ],
    schedule_suggest: [
      'Mình có vài gợi ý lịch dựa trên thói quen của bạn, xem thử nha~',
      'Đề xuất lịch đã sẵn sàng! Click để nhận slot phù hợp nè ♡',
    ],
    focus_prompt: [
      'Bật Focus Mode 25 phút chứ? Ami canh giờ cho!',
      'Tắt thông báo, mình cùng tập trung nhẹ nào~',
    ],
  },
}

