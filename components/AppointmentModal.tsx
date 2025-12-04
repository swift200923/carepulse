'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import CustomFormField from '../CustomFormField';
import SubmitButton from '../SubmitButton';

import { FormFieldType } from '@/lib/Type';
import { getAppointmentSchema } from '@/lib/validation';
import { Doctors } from '@/constants';
import { Appointment } from '@/lib/types/appwrite.types';
import {
  createAppointment,
  updateAppointment,
} from '@/lib/actions/appointment.actions';

type AppointmentFormType = 'create' | 'schedule' | 'cancel';

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  appointment?: Appointment;
  type: AppointmentFormType;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const AppointmentForm = ({
  userId,
  patientId,
  appointment,
  type,
  setOpen,
}: AppointmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = getAppointmentSchema(type);

  // NOTE:
  // - No generic on useForm (let it infer FieldValues = any)
  // - resolver cast to any to avoid the TS mismatch around schedule: unknown / Date
  const form = useForm({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician ?? '',
      schedule: appointment?.schedule ?? new Date(),
      reason: appointment?.reason ?? '',
      note: appointment?.note ?? '',
      cancellationReason: appointment?.cancellationReason ?? '',
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      let status: Appointment['status'] = 'pending';

      switch (type) {
        case 'schedule':
          status = 'scheduled';
          break;
        case 'cancel':
          status = 'cancelled';
          break;
        default:
          status = 'pending';
      }

      if (type === 'create') {
        await createAppointment({
          userId,
          patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: values.schedule,
          reason: values.reason,
          note: values.note,
          status,
        } as any);
      } else if (appointment?.$id) {
        await updateAppointment({
          appointmentId: appointment.$id,
          userId,
          type,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: values.schedule,
            reason: values.reason,
            note: values.note,
            cancellationReason: values.cancellationReason,
            status,
          } as any,
        });
      }

      router.refresh();
      if (setOpen) setOpen(false);
    } catch (error) {
      console.error('Error submitting appointment form', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isCancel = type === 'cancel';

  const buttonLabel =
    type === 'create'
      ? 'Create Appointment'
      : isCancel
      ? 'Cancel Appointment'
      : 'Save Changes';

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {/* Doctor */}
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Doctor"
          placeholder="Select a doctor"
          selectOptions={Doctors.map((doc) => doc.name)}
        />

        {/* Date / Time */}
        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="schedule"
          label="Appointment Date & Time"
          showTimeSelect
        />

        {/* Reason – only for create/schedule */}
        {!isCancel && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="reason"
            label="Reason for visit"
            placeholder="Describe the reason for the appointment"
          />
        )}

        {/* Note – only for create/schedule */}
        {!isCancel && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="note"
            label="Additional Notes"
            placeholder="Any extra information for the doctor"
          />
        )}

        {/* Cancellation Reason – only for cancel */}
        {isCancel && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Cancellation Reason"
            placeholder="Why are you cancelling this appointment?"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            isCancel ? 'shad-danger-btn' : 'shad-primary-btn'
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
