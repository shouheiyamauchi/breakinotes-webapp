import React from 'react'
import { Pagination, List } from 'antd'

import Notes from '../Notes'

const PastPracticeItems = props => (
  <div>
    <List
      size="small"
      bordered
      dataSource={props.pastPracticeItems.slice(10 * props.page - 10, 10 * props.page)}
      renderItem={item => (
        <List.Item
          className={props.onItemClick && 'clickable'}
          onClick={() => {props.onItemClick && props.onItemClick(item)}}
        >
          <div className="full-width">
            <strong>{new Date(item.date).toLocaleDateString()}</strong>
            <Notes text={item.notes} />
          </div>
        </List.Item>
      )}
    />
    <div className="vertical-spacer" />
    <Pagination onChange={props.onPageChange} total={props.pastPracticeItems.length} />
  </div>
)

export default PastPracticeItems
