export interface IStateData<T = any> {
  dataList: Partial<T>[]
  listLoading: boolean
  counts?: number
  requestParameters: Partial<T>
  data: Partial<T>
  dialogFormVisible: boolean
  title: string
  fullscreenLoading: boolean
  toggleSearchStatus: boolean
  rules: Partial<Record<keyof T, RulesItem[]>>
}

export const getState = <T = any>() => {
  return reactive<IStateData<T & any>>({
    dataList: [],
    counts: 0,
    listLoading: false,
    requestParameters: {
      pageNo: 1,
      pageSize: 10
    } as any as T,
    data: {} as T,
    dialogFormVisible: false,
    title: '',
    fullscreenLoading: false,
    toggleSearchStatus: false,
    rules: {} as Partial<Record<keyof (T & any), any[]>>
  })
}
