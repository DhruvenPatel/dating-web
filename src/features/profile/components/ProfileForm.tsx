import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/Textarea";
import { getMaxDob, toDateInput } from "@/lib/date";
import type { Profile } from "@/types/profile";
import { useUpdateProfile } from "../hooks";
import { GENDER_OPTIONS } from "../options";
import { profileSchema, type ProfileFormValues } from "../schemas";

function toFormValues(p: Profile): ProfileFormValues {
  return {
    display_name: p.display_name ?? "",
    bio: p.bio ?? "",
    gender: p.gender ?? "",
    date_of_birth: toDateInput(p.date_of_birth),
    occupation: p.occupation ?? "",
    country: p.country ?? "",
    state: p.state ?? "",
    city: p.city ?? "",
    languages: p.languages ?? [],
    interests: p.interests ?? [],
    hobbies: p.hobbies ?? [],
  };
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const update = useUpdateProfile();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(profile),
  });

  // Re-sync only when the SERVER profile changes (after a save),
  // so photo uploads never wipe unsaved edits.
  useEffect(() => {
    reset(toFormValues(profile));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.updated_at]);

  const bioLength = watch("bio").length;

  const onSubmit = (v: ProfileFormValues) =>
    update.mutate({
      // Backend ignores nulls and rejects "" for these two, so omit when empty.
      ...(v.display_name ? { display_name: v.display_name } : {}),
      ...(v.date_of_birth ? { date_of_birth: v.date_of_birth } : {}),
      bio: v.bio.trim(),
      gender: v.gender,
      occupation: v.occupation,
      country: v.country,
      state: v.state,
      city: v.city,
      languages: v.languages,
      interests: v.interests,
      hobbies: v.hobbies,
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 rounded-lg border bg-card p-5 sm:p-8"
    >
      <div>
        <h3 className="text-lg font-semibold">Edit profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how other people see you on VIPXFRIEND.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Display name"
          placeholder="How should we call you?"
          error={errors.display_name?.message}
          {...register("display_name")}
        />
        <Input
          label="Occupation"
          placeholder="e.g. Designer"
          error={errors.occupation?.message}
          {...register("occupation")}
        />
        <Select
          label="Gender"
          options={GENDER_OPTIONS}
          error={errors.gender?.message}
          {...register("gender")}
        />
        <Input
          label="Date of birth"
          type="date"
          max={getMaxDob()}
          error={errors.date_of_birth?.message}
          {...register("date_of_birth")}
        />
      </div>

      <Textarea
        label="Bio"
        placeholder="Tell people a little about yourself..."
        hint={`${bioLength}/500`}
        error={errors.bio?.message}
        {...register("bio")}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Country" error={errors.country?.message} {...register("country")} />
        <Input label="State" error={errors.state?.message} {...register("state")} />
        <Input label="City" error={errors.city?.message} {...register("city")} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Controller
          control={control}
          name="languages"
          render={({ field }) => (
            <TagInput
              label="Languages"
              placeholder="e.g. English"
              value={field.value}
              onChange={field.onChange}
              error={errors.languages?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <TagInput
              label="Interests"
              placeholder="e.g. Travel"
              value={field.value}
              onChange={field.onChange}
              error={errors.interests?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="hobbies"
          render={({ field }) => (
            <TagInput
              label="Hobbies"
              placeholder="e.g. Cricket"
              value={field.value}
              onChange={field.onChange}
              error={errors.hobbies?.message}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-2 border-t pt-5">
        <Button
          variant="outline"
          disabled={!isDirty || update.isPending}
          onClick={() => reset(toFormValues(profile))}
        >
          Discard
        </Button>
        <Button type="submit" disabled={!isDirty} loading={update.isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}