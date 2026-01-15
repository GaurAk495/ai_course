"use client";

import TextareaAutosize from "react-textarea-autosize";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import axios from "axios";
import { useUser, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { usePrompt } from "@/components/context/promptContext";
import { useRouter } from "next/navigation";
import { courseSchema } from "@/app/api/course/courseGeneratePrompt";

type apiCourseResponseType = {
  message: "success";
  courseId: string;
  courseSlug: string;
  course: courseSchema;
};

export function InputGroupCustom() {
  const { text, setInput, setLoading, loading, type } = usePrompt();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const generateCourse = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    const toastId = toast.loading("Generating course...");
    try {
      setLoading(true);
      const response = await axios.post<apiCourseResponseType>("/api/course", {
        userInput: text,
        type,
      });
      toast.success("Course generated successfully", { id: toastId });
      const courseData = response.data;
      router.push(`/course/${courseData.courseSlug}/${courseData.courseId}`);
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <InputGroup className="max-w-xl mx-auto gap-6 bg-background/70 shadow-sm">
      <TextareaAutosize
        data-slot="input-group-control"
        className="flex field-sizing-content min-h-24 w-full resize-none rounded-md px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
        placeholder="Enter your topic here..."
        value={text}
        onChange={(e) => setInput(e.target.value)}
      />
      <InputGroupAddon align="block-end">
        <SelectType />
        <InputGroupButton
          className="ml-auto cursor-pointer disabled:cursor-not-allowed"
          size="sm"
          variant="default"
          disabled={loading}
          onClick={generateCourse}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

function SelectType() {
  const { type, setType } = usePrompt();
  return (
    <Select value={type} onValueChange={setType} defaultValue="full-course">
      <SelectTrigger className="w-50px rounded-full" suppressHydrationWarning>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="full-course">Full Course</SelectItem>
        <SelectItem value="quick-explain-video">Quick Explain Video</SelectItem>
      </SelectContent>
    </Select>
  );
}
