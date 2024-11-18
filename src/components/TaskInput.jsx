import { useState } from 'react'
import Timer from './Timer'

function TaskInput({ setNewEntry }) {
  const [input, setInput] = useState('')

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  return (
    <>
      <div className="flex rounded-lg my-5 items-center">
        <input
          size="40"
          value={input}
          onChange={handleInputChange} // Update input value
          className="bg-gray-50 focus:outline-none rounded-lg p-2 shadow-sm"
          type="text"
          placeholder="What are you working on?"
        />
        <Timer setNewEntry={setNewEntry} input={input} setInput={setInput} />
      </div>
    </>
  )
}

export default TaskInput
