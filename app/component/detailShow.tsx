

function DetailShow({passwords,title,value }) {
  return (
       <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {value === "all" ? passwords.length: passwords.filter((p) => p.category === value).length}
              </p>
          </div>
  )
}

export default DetailShow