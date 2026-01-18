import { useState, useId } from "react";
import type { FormEvent } from "react";
import { format } from "date-fns";

import Input from "@shared/input";
import Button from "@shared/button";
import Typography from "@shared/typography";

import type { CreateEventFormProps } from "./createEventForm.types";

import styles from "./createEventForm.module.scss";

function CreateEventForm({ onSubmit, disabled = false }: CreateEventFormProps) {
  const formId = useId();
  const errorId = `${formId}-error`;
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (endTime <= startTime) {
      setError("End time must be after start time");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ title, date, startTime, endTime });
      setTitle("");
      setDate(format(new Date(), "yyyy-MM-dd"));
      setStartTime("09:00");
      setEndTime("10:00");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = disabled || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      aria-labelledby={`${formId}-title`}
      aria-describedby={error ? errorId : undefined}
      noValidate
    >
      <Typography variant="h3" className={styles.title} id={`${formId}-title`}>
        Create Event
      </Typography>

      <Input
        label="Event Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter meeting title"
        disabled={isDisabled}
        required
        aria-required="true"
        autoComplete="off"
      />

      <Input
        label="Event Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={isDisabled}
        required
        aria-required="true"
      />

      <fieldset className={styles.timeRow}>
        <legend className={styles.visuallyHidden}>Event time range</legend>
        <Input
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          disabled={isDisabled}
          required
          aria-required="true"
        />
        <Input
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={isDisabled}
          required
          aria-required="true"
        />
      </fieldset>

      {error && (
        <Typography
          variant="caption"
          className={styles.error}
          id={errorId}
          role="alert"
          aria-live="polite"
        >
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isDisabled}
        aria-label={isSubmitting ? "Creating event, please wait" : "Create new event"}
      >
        {isSubmitting ? "Creating..." : "Create Event"}
      </Button>
    </form>
  );
}

export default CreateEventForm;
