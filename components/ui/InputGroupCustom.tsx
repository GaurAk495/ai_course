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
import { usePrompt } from "../context/promptContext";

export function InputGroupCustom() {
  const { text, setInput, setLoading, loading, type } = usePrompt();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const generateCourse = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    const toastId = toast.loading("Generating course...");
    try {
      setLoading(true);
      const response = await axios.post("/api/course", {
        userInput: text,
        type,
      });
      console.log(response.data);
      toast.success("Course generated successfully", { id: toastId });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

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
      <SelectTrigger
        className="w-[200px] rounded-full"
        suppressHydrationWarning
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="full-course">Full Course</SelectItem>
        <SelectItem value="quick-explain-video">Quick Explain Video</SelectItem>
      </SelectContent>
    </Select>
  );
}
