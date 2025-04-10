import clsx from "clsx";

export function Input({
    className,
    type = "text",
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
      <input
        type={type}
        className={clsx(
          "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
          className
        )}
        {...props}
      />
    );
  }