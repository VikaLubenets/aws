#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
import "source-map-support/register";
import { App, Stack, StackProps } from "@aws-cdk/core";
import { AppStack } from "../lib/app-stack";

class MyApp extends App {
  constructor() {
    super();

    new AppStack(this, "AppStack");
  }
}

new MyApp().synth();
