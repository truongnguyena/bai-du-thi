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
      analyticsSummary: 'Tổng quan',
      total: 'Tổng',
      completed: 'Hoàn thành',
      overdue: 'Quá hạn',
      estTotal: 'Tổng ước lượng',
      actualTotal: 'Tổng thực tế',
      tasksCreated: 'Nhiệm vụ tạo',
      last14Days: '14 ngày gần đây',
      minutes: 'phút',
      noData: 'Chưa có dữ liệu',
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
      analyticsSummary: 'Summary',
      total: 'Total',
      completed: 'Completed',
      overdue: 'Overdue',
      estTotal: 'Estimated total',
      actualTotal: 'Actual total',
      tasksCreated: 'Tasks created',
      last14Days: 'Last 14 days',
      minutes: 'minutes',
      noData: 'No data yet',
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

