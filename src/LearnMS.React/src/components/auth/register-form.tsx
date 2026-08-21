import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterRequest, useRegisterMutation } from "@/api/auth-api";
import { toast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import InputField from "./input-field";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button as ShadButton } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RegisterFormProps {
  setIsLoginView: (value: boolean) => void;
}

const RegisterForm = ({ setIsLoginView }: RegisterFormProps) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const registerMutation = useRegisterMutation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const registerForm = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequest),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      level: "" as unknown as any,
      phoneNumber: "",
      school: "",
      parentPhoneNumber: "",
      studentCode: "",
    },
  });

  const registerErrors = registerForm.formState.errors;

  // Define all animations inline
  const formContainerVariants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Each input appears 150ms after the previous one
        delayChildren: 0.1, // Small initial delay
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const inputVariants = {
    initial: {
      opacity: 0,
      x: isRTL ? -150 : 150, // Large x translation
      filter: "blur(10px)",
    },
    animate: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      x: isRTL ? 150 : -150,
      filter: "blur(10px)",
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const gridContainerVariants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger grid items
      },
    },
  };

  const onRegister = async (data: RegisterRequest) => {
    try {
      await registerMutation.mutateAsync(data);
      toast({
        title: t("auth.forms.errors.accountCreated"),
        description: t("auth.forms.errors.welcomeBack"),
        variant: "default",
      });
      setIsLoginView(true);
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || t("auth.forms.errors.registrationFailed");
      toast({
        title: t("auth.forms.errors.registrationFailed"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.form
      variants={formContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onSubmit={registerForm.handleSubmit(onRegister)}
      className="space-y-6"
    >
      {/* 1. Full Name - FIRST */}
      <motion.div variants={inputVariants}>
        <InputField
          error={registerErrors?.fullName}
          register={registerForm.register}
          placeholder={t("auth.forms.fullName.placeholder")}
          name="fullName"
          label={t("auth.forms.fullName.label")}
        />
      </motion.div>

      {/* 2. Phone Numbers Grid - SECOND */}
      <motion.div
        variants={gridContainerVariants}
        className="grid grid-cols-2 gap-6"
      >
        <motion.div variants={inputVariants}>
          <InputField
            error={registerErrors?.phoneNumber}
            register={registerForm.register}
            placeholder={t("auth.forms.phoneNumber.placeholder")}
            name="phoneNumber"
            label={t("auth.forms.phoneNumber.label")}
          />
        </motion.div>
        <motion.div variants={inputVariants}>
          <InputField
            error={registerErrors?.parentPhoneNumber}
            register={registerForm.register}
            placeholder={t("auth.forms.parentPhoneNumber.placeholder")}
            name="parentPhoneNumber"
            label={t("auth.forms.parentPhoneNumber.label")}
          />
        </motion.div>
      </motion.div>

      {/* 3. Student Code and Level Grid - THIRD */}
      <motion.div
        variants={gridContainerVariants}
        className="grid grid-cols-2 gap-6"
      >
        <motion.div variants={inputVariants}>
          <InputField
            error={registerErrors?.studentCode}
            register={registerForm.register}
            placeholder={t("auth.forms.studentCode.placeholder")}
            name="studentCode"
            label={t("auth.forms.studentCode.label")}
          />
        </motion.div>

        <motion.div variants={inputVariants} className="space-y-2">
          <label
            htmlFor="level"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {t("auth.forms.level.label")}
          </label>
          <Controller
            control={registerForm.control}
            name="level"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue=""
              >
                <SelectTrigger
                  id="level"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-zinc-400 dark:focus:border-zinc-600 placeholder:text-zinc-400 text-black dark:text-white dark:placeholder:text-zinc-500",
                    registerErrors?.level
                      ? "border-red-400 dark:border-red-300"
                      : "border-zinc-200 dark:border-zinc-700"
                  )}
                >
                  <SelectValue
                    placeholder={t("auth.forms.level.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Level0">
                    {t("auth.forms.level.options.level0")}
                  </SelectItem>
                  <SelectItem value="Level1">
                    {t("auth.forms.level.options.level1")}
                  </SelectItem>
                  <SelectItem value="Level2">
                    {t("auth.forms.level.options.level2")}
                  </SelectItem>
                  <SelectItem value="Level3">
                    {t("auth.forms.level.options.level3")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {registerErrors?.level && (
            <p className="text-sm text-red-400 dark:text-red-300">
              {registerErrors.level.message}
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* 4. School - FOURTH */}
      <motion.div variants={inputVariants}>
        <InputField
          error={registerErrors?.school}
          register={registerForm.register}
          placeholder={t("auth.forms.school.placeholder")}
          name="school"
          label={t("auth.forms.school.label")}
        />
      </motion.div>

      {/* 5. Email - FIFTH */}
      <motion.div variants={inputVariants}>
        <InputField
          type="email"
          error={registerErrors?.email}
          register={registerForm.register}
          placeholder={t("auth.forms.email.placeholder")}
          name="email"
          label={t("auth.forms.email.label")}
        />
      </motion.div>

      {/* 6. Password - SIXTH */}
      <motion.div variants={inputVariants}>
        <InputField
          error={registerErrors?.password}
          register={registerForm.register}
          placeholder={t("auth.forms.password.placeholder")}
          isPassword
          name="password"
          label={t("auth.forms.password.label")}
          passwordShown={passwordShown}
          setPasswordShown={setPasswordShown}
        />
      </motion.div>

      {/* 7. Confirm Password - SEVENTH */}
      <motion.div variants={inputVariants}>
        <InputField
          error={registerErrors?.confirmPassword}
          register={registerForm.register}
          placeholder={t("auth.forms.confirmPassword.placeholder")}
          isPassword
          name="confirmPassword"
          label={t("auth.forms.confirmPassword.label")}
          passwordShown={passwordShown}
          setPasswordShown={setPasswordShown}
        />
      </motion.div>

      {/* 8. Submit Button - EIGHTH */}
      <motion.div variants={inputVariants}>
        <ShadButton
          type="submit"
          disabled={registerMutation.isPending}
          size="lg"
          className="w-full"
        >
          <UserPlus className="w-5 h-5" />
          <span>{t("auth.forms.createAccount")}</span>
        </ShadButton>
      </motion.div>
    </motion.form>
  );
};

export default RegisterForm;
