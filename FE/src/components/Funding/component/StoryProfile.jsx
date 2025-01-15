function StoryProfile({ onClick, name, img }) {
  return (
    <div
      onClick={onClick}
      className="MyStory flex-none flex-col items-center justify-center p-4"
    >
      <img src={img} alt={name} className="h-14 w-14 rounded-full" />
      <p className="text-center">{name}</p>
    </div>
  );
}

export default StoryProfile;
