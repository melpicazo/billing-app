interface TabLayoutProps extends React.PropsWithChildren {
  title: string;
  description: string;
}

export const TabLayout = ({ title, description, children }: TabLayoutProps) => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="container-default-spacing flex flex-col gap-4 border-b border-gray-200 bg-white shadow-sm">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="container-default-spacing flex flex-col gap-8">
        {children}
      </div>
    </div>
  );
};
