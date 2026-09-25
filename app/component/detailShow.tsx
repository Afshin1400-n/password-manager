function DetailShow({ passwords, title, value }) {
  const count =
    value === "all"
      ? passwords.length
      : value === "favorite"
        ? passwords.filter((p) => p.isFavorite).length
        : passwords.filter((p) => p.category === value).length;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-purple-600 mt-1">{count}</p>
    </div>
  );
}

export default DetailShow;