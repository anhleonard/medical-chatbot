export const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-fit my-4">
      <div className="animate-pulse w-[97%]">
        <div className="h-6 mt-2 w-full rounded-sm bg-grey-c400 opacity-30"></div>
        <div className="animate-pulse">
          <div className="h-6 mt-2 w-full rounded-sm bg-grey-c400 opacity-30"></div>
          <div className="animate-pulse">
            <div className="h-6 mt-2 w-full rounded-sm bg-grey-c400 opacity-30"></div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-6 mt-2 w-full rounded-sm bg-grey-c400 opacity-30"></div>
        </div>
      </div>
    </div>
  );
};