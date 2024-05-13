import { FormatNumber } from '@/helper'
import React, { useEffect, useRef, useState } from 'react'

interface PriceRangeProps {
  min?: number;
  max?: number;
  isRest?: boolean;
  onGoClick: (min: number, max: number) => void;
  onRestPrice?: () => void;
}

const PriceRangeSlider: React.FC<PriceRangeProps> = ({
  min = 0,
  max = 10000000,
  isRest = false,
  onGoClick,
  onRestPrice,
}) => {
  const [isPendingSummit, setIsPendingSummit] = useState<boolean>(true)
  const [minValue, setMinValue] = useState<number>(min)
  const [maxValue, setMaxValue] = useState<number>(max)

  const refDebounce = useRef<any>(null)

  useEffect(() => {
    if (isPendingSummit) return setIsPendingSummit(false)

    refDebounce.current = setTimeout(() => {
      onGoClick(minValue, maxValue)
    }, 1000)

    return () => {
      clearTimeout(refDebounce.current)
      refDebounce.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minValue, maxValue])

  useEffect(() => {
    if (isRest) {
      setMinValue(min)
      setMaxValue(max)
      onRestPrice?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRest])

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinValue(parseInt(event.target.value))
  }

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxValue(parseInt(event.target.value))
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    callBack: (value: number) => void
  ) => {
    const rawValue = event.target.value
    const onlyDigits = rawValue.replace(/\D/g, '')
    const valueSet = Number(onlyDigits)
    if (valueSet > max) return callBack(max)
    if (valueSet < min) return callBack(min)
    callBack(valueSet)
  }

  return (
    <div className="price-card">
      <div className="slider">
        <div
          className="progress"
          style={{
            left: `${(minValue / max) * 100}%`,
            right: `${((max - maxValue) / max) * 100}%`,
          }}></div>
      </div>
      <div className="range-input">
        <input
          type="range"
          className="range-min"
          min="0"
          max={max}
          value={minValue}
          step="100"
          onChange={handleMinChange}
        />
        <input
          type="range"
          className="range-max"
          min="0"
          max={max}
          value={maxValue}
          step="100"
          onChange={handleMaxChange}
        />
      </div>
      <div className="row mt-20 align-items-center gx-0 w-100">
        <div className="col-9 w-100">
          <div className="price-input">
            <div className="field">
              {/* <span className="sympol">VNĐ</span> */}
              <input
                type="text"
                className="input-min fsz-12 w-100"
                value={FormatNumber(minValue, '.')}
                onChange={(e) => handleInputChange(e, setMinValue)}
              />
            </div>
            <div className="separator"></div>
            <div className="field">
              {/* <span className="sympol">VNĐ</span> */}
              <input
                type="text"
                className="input-max fsz-12 w-100"
                value={FormatNumber(maxValue, '.')}
                onChange={(e) => handleInputChange(e, setMaxValue)}
              />
            </div>
          </div>
        </div>
        {/* <div className="col-3 text-end">
          <button className="bttn" onClick={handleGoClick}>
            Go
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default PriceRangeSlider
