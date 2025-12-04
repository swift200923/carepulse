"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AppointmentForm from "./forms/AppointmentForm";
import { Appointment } from "@/lib/types/appwrite.types";

type AppointmentModalProps = {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title: string;
  description: string;
};

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
  title,
  description,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);

  const buttonLabel = type === "cancel" ? "Cancel" : "Schedule";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            type === "cancel"
              ? "shad-danger-btn"
              : "shad-primary-btn"
          }
        >
          {buttonLabel} appointment
        </Button>
      </DialogTrigger>

      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
