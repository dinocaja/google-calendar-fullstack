import type { CreateEventFormInput } from "@app-types/events";

interface CreateEventFormProps {
  onSubmit: (input: CreateEventFormInput) => Promise<void>;
  disabled?: boolean;
}

export type { CreateEventFormProps };
