import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  required,
  error,
  hint,
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  let renderedChild = children;

  if (React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    renderedChild = React.cloneElement(children, {
      id: childProps.id ?? id,
      "aria-invalid": childProps["aria-invalid"] ?? (error ? true : undefined),
      "aria-describedby": childProps["aria-describedby"] ?? describedBy,
      className: cn(
        childProps.className as string | undefined,
        error && "!border-rose-500 !ring-rose-500/20"
      ),
    } as Record<string, unknown>);
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "block text-xs font-semibold text-zinc-700 tracking-tight",
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-orange-600 ml-1 font-bold">*</span>}
      </label>

      {renderedChild}

      {hint && !error && (
        <p id={hintId} className="text-[11px] text-zinc-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-rose-600 text-[11px] font-medium flex items-center gap-1 animate-in fade-in duration-150"
        >
          {error}
        </p>
      )}
    </div>
  );
}
