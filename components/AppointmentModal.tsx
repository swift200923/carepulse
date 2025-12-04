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

import { Appointment } from "@/lib/types/appwrite.types";
import AppointmentForm from "./forms/AppointmentForm";

type AppointmentModalType = "create" | "schedule" | "cancel";

interface AppointmentModalProps {
  userId: string;
  patientId: string;
  appointment?: Appointment;
  type: AppointmentModalType;
  title: string;
  description: string;
}

const AppointmentModal = ({
  userId,
  patientId,
  appointment,
  type,
  title,
  description,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);

  const buttonLabel =
    type === "cancel" ? "Cancel" : type === "schedule" ? "Schedule" : "Create";

  const buttonVariant =
    type === "cancel" ? "destructive" : "default" as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          className="min-w-[110px]"
        >
          {buttonLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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

export default AppointmentModal;
