import { FC, useEffect, useState } from 'react'
import { clsx, editTableData, getTableData } from '../../helper'
import styles from './index.module.css'
import { useHelper, useViewState } from '../../context'
import { TableSvg } from '../svg'
import { Button } from '../button'

//#region component Types
export interface TableProps {
  className?: string
  style?: React.CSSProperties
}
//#endregion component Types

const PAGESIZE = 50
//#region component
export const Table: FC<TableProps> = (props) => {
  const { className, style } = props
  const { query, exec } = useHelper()
  const { selectedTable, setSelectedRow, selectedRow } = useViewState()
  const columns = selectedTable?.columns

  const [page] = useState(1)
  const [data, setData] = useState<any[]>([])
  const queryTableData = async () => {
    if (!selectedTable) return
    const res = await getTableData(query, selectedTable.name, {
      page,
      pageSize: PAGESIZE,
    })
    setData(res)
    console.log(res)
    return res
  }

  useEffect(() => {
    queryTableData()
  }, [selectedTable])

  const onColumnDoubleClick = async (row: any, column: any) => {
    console.log('row[column.name]', row, column)
    const value = prompt('请输入新的值', row[column.name])
    if (value === null) return
    if (!selectedTable) return
    await editTableData(exec, selectedTable.name, row, column.name, value)
    queryTableData()
  }

  if (!columns) return null

  return (
    <div className={clsx(className, styles.root)} style={style}>
       <div className={clsx(className, styles.tools)}>
        <div className={clsx(className, styles.left)}>
          <TableSvg />
          {selectedTable.name}
        </div>
        <div className={clsx(className, styles.right)}>
          <div onClick={() => queryTableData()}>刷新</div>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table
          className={styles.table}
          border={0}
          cellPadding={0}
          cellSpacing={0}
        >
          <thead>
            <tr>
              <th className={styles.placeholder}></th>
              {columns.map((column) => (
                <th key={column.name}>{column.name}</th>
              ))}
              <th className={styles.placeholder}></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const jsonStr = JSON.stringify(row)
              const isSelected = selectedRow === jsonStr
              return (
                <tr
                  key={rowIndex}
                  tabIndex={1}
                  onClick={() => {
                    setSelectedRow(jsonStr)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedRow(jsonStr)
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                  }}
                  className={clsx(styles.row, isSelected && styles.selected)}
                >
                  <td className={styles.placeholder}></td>

                  {columns.map((column) => (
                    <td
                      key={column.name}
                      onDoubleClick={() => {
                        onColumnDoubleClick(row, column)
                      }}
                    >
                      {row[column.name]}
                    </td>
                  ))}
                  <td className={styles.placeholder}></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <Button disabled={true}>上一页</Button>
        <Button>下一页</Button>
      </div>
    </div>
  )
}
//#endregion component
