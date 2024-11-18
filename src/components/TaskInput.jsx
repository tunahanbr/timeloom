import React from 'react'
import Timer from './Timer'

function TaskInput() {
  return (
    <>
      <div className="flex rounded-lg my-5 items-center">
          <input size="40" className="bg-gray-50 focus:outline-none rounded-lg p-2 shadow-sm" type="text" placeholder="What are you working on?" />
          <Timer />
      </div>
    </>
  )
}

export default TaskInput