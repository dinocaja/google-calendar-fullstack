type ClassValue = string | number | boolean | null | undefined;

function classNames(...args: ClassValue[]): string {
  return args.filter(Boolean).join(" ");
}

export { classNames };
