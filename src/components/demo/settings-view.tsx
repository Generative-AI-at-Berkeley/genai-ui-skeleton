"use client";

import { useState } from "react";
import { css } from "styled-system/css";

import { OptionSelect } from "@/components/common/option-select";
import { Section } from "@/components/common/section";
import { ErrorState } from "@/components/common/states";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import {
  Badge,
  Button,
  Checkbox,
  Field,
  Input,
  Spinner,
  Textarea,
} from "@/components/ui";
import { useHealth } from "@/hooks/use-health";

const REGION_OPTIONS = [
  { value: "us-west", label: "US West" },
  { value: "us-east", label: "US East" },
  { value: "eu-central", label: "EU Central" },
];

export function SettingsView() {
  const [workspace, setWorkspace] = useState("GenAI at Berkeley");
  const [region, setRegion] = useState("us-west");
  const [digest, setDigest] = useState(true);

  return (
    <>
      <PageHeader
        title="Settings"
        help="Form fields in a reading-width column. Nothing on this page saves."
        actions={
          <Button size="sm" variant="solid">
            Save changes
          </Button>
        }
      />
      <PageBody width="reading">
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "6",
            maxW: "xl",
          })}
        >
          <Section title="Workspace">
            <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input
                  size="sm"
                  value={workspace}
                  onChange={(event) => setWorkspace(event.target.value)}
                />
                <Field.HelperText>Shown in the sidebar and on exports.</Field.HelperText>
              </Field.Root>
              <OptionSelect
                label="Region"
                value={region}
                options={REGION_OPTIONS}
                onChange={setRegion}
              />
              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Textarea
                  size="sm"
                  rows={3}
                  defaultValue="Student builders shipping applied AI projects."
                />
              </Field.Root>
              <Checkbox.Root
                size="sm"
                checked={digest}
                onCheckedChange={(details) => setDigest(details.checked === true)}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Send a weekly digest to project leads</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
            </div>
          </Section>

          <Section title="API connection">
            <ApiStatus />
          </Section>
        </div>
      </PageBody>
    </>
  );
}

/**
 * The one live call in the skeleton: GET /v1/health through the proxy. With no
 * API configured it shows the error state, which is the pattern to copy.
 */
function ApiStatus() {
  const health = useHealth();

  if (health.isPending) {
    return (
      <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
        <Spinner size="sm" />
        <span className={css({ textStyle: "table.cell", color: "fg.muted" })}>
          Checking the API
        </span>
      </div>
    );
  }

  if (health.isError) {
    return (
      <div
        className={css({
          borderWidth: "1px",
          borderColor: "app.line",
          borderRadius: "l2",
        })}
      >
        <ErrorState title="API not reachable" message={health.error.message} />
      </div>
    );
  }

  return (
    <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
      <Badge size="sm" variant="subtle" colorPalette="green">
        Connected
      </Badge>
      <span className={css({ textStyle: "table.cell", color: "fg.muted" })}>
        {health.data.version ? `Version ${health.data.version}` : health.data.status}
      </span>
    </div>
  );
}
