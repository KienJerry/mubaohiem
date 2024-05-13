export const Tag = ({ color, title }: { title: string; color: string }) => {
  return (
    <div className="relative overflow-hidden rounded-full flex items-center justify-center mt-[4px]">
      <span
        className={`absolute left-[0px] right-[0px] bottom-[0px] top-[0px] bg-[${color}] opacity-10`}
      ></span>
      <span className="text-[10px] font-semibold leading-[15px] px-[8px] py-[4px]">{title}</span>
    </div>
  )
}
