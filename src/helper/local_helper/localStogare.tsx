interface ICreateLocalType {
  type?: string | object | number | any[];
  key: string;
  data?: any;
}

//Create and Update
export const __CreateDataLocal = (props: ICreateLocalType): boolean | void => {
  switch (props.type) {
    case 'object': {
      typeof window !== 'undefined' && localStorage?.setItem(props.key, JSON.stringify(props.data))
      return
    }
    case 'string': {
      typeof window !== 'undefined' && localStorage?.setItem(props.key, props.data)
      return
    }
    case 'array': {
      const getExistingData = localStorage?.getItem(props.key)
      let cloneDataArray = getExistingData ? JSON.parse(getExistingData) : []
      const existingItemIndex = cloneDataArray.findIndex((item: any) => item?.id === props.data?.id)
      if (existingItemIndex !== -1) {
        cloneDataArray[existingItemIndex] = props.data
      } else {
        cloneDataArray.push(props.data)
      }
      localStorage?.setItem(props.key, JSON.stringify(cloneDataArray))
      return existingItemIndex === -1
    }
    default:
      return
  }
}

// Read
export const __getDataLocal = (props: ICreateLocalType) => {
  switch (props.type) {
    case 'object': {
      const existingDataString = localStorage?.getItem(props?.key)
      return existingDataString ? JSON.parse(existingDataString) : null
    }
    case 'string': {
      return   typeof window !== 'undefined' && localStorage?.getItem(props?.key)
    }
    case 'array': {
      const existingDataString = localStorage?.getItem(props?.key)
      return existingDataString ? JSON.parse(existingDataString) : null
    }
    default:
      return
  }
}

// Remove
export const __RemoveItemLocal = (props: ICreateLocalType) => {
  return localStorage?.removeItem(props?.key)
}

//Remove single item
export const __RemoveSingleItemLocal = (props: ICreateLocalType) => {
  const getExistingData = localStorage?.getItem(`${props.key}`)
  let cloneDataArray = getExistingData ? JSON.parse(getExistingData) : []
  const existingItemIndex = cloneDataArray.findIndex((item: any) => item?.id === props?.data?.id)

  if (existingItemIndex !== -1) {
    cloneDataArray.splice(existingItemIndex, 1)
    localStorage?.setItem(`${props?.key}`, JSON.stringify(cloneDataArray))

    return true
  }
  return false
}
