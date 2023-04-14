// Loading component

export default function Loading() {
  return (
    <div className="relative w-full h-full">
      <div className="loading z-50 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <span className="grid grid-cols-3 grid-rows-3 gap-px">
          <span className="animate-fade mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="animate-fade animation-delay-300 mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="animate-fade animation-delay-700 mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="animate-fade animation-delay-100 mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="animate-fade animation-delay-500 mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="animate-fade animation-delay-300 mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="animate-fade animation-delay-700 mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="animate-fade animation-delay-500 mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
          <span className="animate-fade animation-delay-200 mx-px h-1.5 w-1.5 rounded-full bg-slate-300"></span>
        </span>
      </div>
    </div>
  );
}
