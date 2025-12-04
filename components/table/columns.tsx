"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { Appointment } from "@/lib/types/appwrite.types";
import { formatDateTime } from "@/lib/utils";

import AppointmentModal from "../AppointmentModal";

export const columns: ColumnDef<Appointment>[] = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">{row.index + 1}</span>
    ),
  },
  {
    id: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doc) => doc.name === appointment.primaryPhysician
      );

      const { dateOnly, timeOnly } = formatDateTime(appointment.schedule);

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image ?? Doctors[0].image}
            alt={doctor?.name ?? "Doctor"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-dark-700">
              {appointment.patient.name}
            </span>
            <span className="text-xs text-gray-500">
              {dateOnly} • {timeOnly}
            </span>
            <span className="text-xs text-gray-500">
              {appointment.primaryPhysician}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");

      const badgeClass =
        status === "scheduled"
          ? "bg-green-100 text-green-700"
          : status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700";

      const label =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    id: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <p className="max-w-xs truncate text-sm text-gray-700">
          {appointment.reason}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-2">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];
