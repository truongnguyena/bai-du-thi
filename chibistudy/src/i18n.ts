import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  vi: {
    translation: {
      appName: 'ChibiStudy',
      appTagline: 'Quản lý thời gian cho sinh viên VN',
      inbox: 'Hộp thư',
      calendar: 'Lịch',
      analytics: 'Phân tích',
      focus: 'Tập trung',
      settings: 'Cài đặt',
      search: 'Tìm kiếm nhiệm vụ...',
      helloAmi: 'Xin chào, Ami ♡',
      addTaskPlaceholder: 'Thêm nhiệm vụ...',
      estimatePlaceholder: 'Ước lượng (phút)',
      tagsPlaceholder: 'tags, cách nhau bằng dấu phẩy',
      add: 'Thêm',
      emptyTasks: 'Chưa có nhiệm vụ nào',
      due: 'Hạn',
      noDue: 'Không hạn',
      high: 'Cao',
      calendarTip: 'Kéo thả để thay đổi hạn',
      focusTitle: 'Chế độ Tập trung',
      settingsTitle: 'Cài đặt',
      language: 'Ngôn ngữ',
      vi: 'Tiếng Việt',
      en: 'English',
    },
  },
  en: {
    translation: {
      appName: 'ChibiStudy',
      appTagline: 'Time manager for VN students',
      inbox: 'Inbox',
      calendar: 'Calendar',
      analytics: 'Analytics',
      focus: 'Focus',
      settings: 'Settings',
      search: 'Search tasks...',
      helloAmi: 'Hello, Ami ♡',
      addTaskPlaceholder: 'Add a task...',
      estimatePlaceholder: 'Estimate (min)',
      tagsPlaceholder: 'tags, comma separated',
      add: 'Add',
      emptyTasks: 'No tasks yet',
      due: 'Due',
      noDue: 'No due',
      high: 'HIGH',
      calendarTip: 'Drag to update due date',
      focusTitle: 'Focus Mode',
      settingsTitle: 'Settings',
      language: 'Language',
      vi: 'Vietnamese',
      en: 'English',
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator', 'htmlTag'], caches: ['localStorage'] },
  })

export default i18n

