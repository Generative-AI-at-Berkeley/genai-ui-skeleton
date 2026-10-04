"use client";

import { Portal } from "@ark-ui/react/portal";
import { Plus } from "lucide-react";
import { useState } from "react";
import { css } from "styled-system/css";

import { OptionSelect } from "@/components/common/option-select";
import { Button, CloseButton, Dialog, Field, Input, Textarea } from "@/components/ui";
import { PROJECT_STATUS_LABEL, ProjectStatus } from "@/types/enums";

const STATUS_OPTIONS = Object.values(ProjectStatus).map((status) => ({
  value: status,
  label: PROJECT_STATUS_LABEL[status],
}));

/**
 * The dialog pattern: a centered form for one short task. Dialogs are the one
 * place a shadow and a backdrop are allowed, because they really are above
 * the page. A panel beside content is SidePanel instead.
 */
export function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string>(ProjectStatus.ACTIVE);
  const nameMissing = name.trim() === "";

  return (
    <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
      <Dialog.Trigger asChild>
        <Button size="sm" variant="solid">
          <Plus size={14} />
          New project
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>New project</Dialog.Title>
              <Dialog.Description>
                This demo does not save. Wire the submit to an API call.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <div
                className={css({ display: "flex", flexDirection: "column", gap: "4" })}
              >
                <Field.Root invalid={nameMissing}>
                  <Field.Label>Name</Field.Label>
                  <Input
                    size="sm"
                    value={name}
                    placeholder="Course notes assistant"
                    onChange={(event) => setName(event.target.value)}
                  />
                  <Field.ErrorText>Name is required.</Field.ErrorText>
                </Field.Root>
                <OptionSelect
                  label="Status"
                  value={status}
                  options={STATUS_OPTIONS}
                  onChange={setStatus}
                />
                <Field.Root>
                  <Field.Label>Summary</Field.Label>
                  <Textarea
                    size="sm"
                    rows={3}
                    placeholder="One sentence on what it does."
                  />
                  <Field.HelperText>Shown in the project side panel.</Field.HelperText>
                </Field.Root>
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                size="sm"
                variant="solid"
                disabled={nameMissing}
                onClick={() => setOpen(false)}
              >
                Create project
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
