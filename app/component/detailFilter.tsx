
function DetailFilter({title, value , setFilter , currentFilter }) {
  return (
      <button className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${currentFilter === value
    ? "bg-blue-500 text-white": "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={()=>setFilter(value)}>
              {title}
            </button>
  )
}

export default DetailFilter