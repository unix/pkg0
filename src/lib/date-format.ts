import { PACKAGE_DATA_CONFIG } from '@/lib/config'

export const formatCheckedAt = (checkedAt: number) =>
  new Intl.DateTimeFormat(
    PACKAGE_DATA_CONFIG.dateFormat.locale,
    PACKAGE_DATA_CONFIG.dateFormat.checkedAt,
  ).format(new Date(checkedAt))
