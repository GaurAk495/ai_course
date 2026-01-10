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
import { Send } from "lucide-react";

export function InputGroupCustom() {
  return (
    <InputGroup className="max-w-xl mx-auto gap-6 bg-background/70 shadow-sm">
      <TextareaAutosize
        data-slot="input-group-control"
        className="flex field-sizing-content min-h-24 w-full resize-none rounded-md px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
        placeholder="Autoresize textarea..."
      />
      <InputGroupAddon align="block-end">
        <Select>
          <SelectTrigger className="w-[140px] ">
            <SelectValue placeholder="Full Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-course">Full Course</SelectItem>
            <SelectItem value="quick-explain-video">
              Quick Explain Video
            </SelectItem>
          </SelectContent>
        </Select>
        <InputGroupButton className="ml-auto" size="sm" variant="default">
          <Send />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
