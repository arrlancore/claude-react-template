"use client";

import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StyleguidePage() {
  // const [isDevMode, setIsDevMode] = useState(false);
  const isDevMode = process.env.NODE_ENV === "development";
  console.log("isDev", isDevMode);

  // useEffect(() => {
  //   // Check if we're in development mode
  //   // This can only be accurately determined on the client side when using Next.js
  //   setIsDevMode(process.env.NODE_ENV === "development");
  // }, []);

  // If not in development mode, show 404
  if (!isDevMode) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-3">UI Component Style Guide</h1>
        <p className="text-muted-foreground mb-6">
          This page is only visible in development mode and provides a
          comprehensive view of all UI components and their variants.
        </p>

        <Tabs defaultValue="typography" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none mb-6">
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="forms">Form Elements</TabsTrigger>
          </TabsList>

          <TabsContent value="typography" className="space-y-8">
            <StyleSection
              title="Headings"
              description="Typography styles for headings"
            >
              <div className="space-y-4">
                <div>
                  <h1 className="text-5xl font-bold">Heading 1</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    text-5xl font-bold
                  </p>
                </div>
                <div>
                  <h2 className="text-4xl font-bold">Heading 2</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    text-4xl font-bold
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">Heading 3</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    text-3xl font-bold
                  </p>
                </div>
                <div>
                  <h4 className="text-2xl font-semibold">Heading 4</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    text-2xl font-semibold
                  </p>
                </div>
                <div>
                  <h5 className="text-xl font-semibold">Heading 5</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    text-xl font-semibold
                  </p>
                </div>
                <div>
                  <h6 className="text-lg font-semibold">Heading 6</h6>
                  <p className="text-sm text-muted-foreground mt-1">
                    text-lg font-semibold
                  </p>
                </div>
              </div>
            </StyleSection>

            <StyleSection
              title="Body Text"
              description="Typography styles for body text"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-base">
                    Base text (text-base): This is the standard body text used
                    throughout the application. It should provide good
                    readability and be used for most content.
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    Small text (text-sm): Used for secondary information,
                    captions, and UI elements where space is limited or where
                    information should be presented in a more compact form.
                  </p>
                </div>
                <div>
                  <p className="text-xs">
                    Extra small text (text-xs): Used for very small UI elements,
                    footnotes, and other minimal text elements.
                  </p>
                </div>
                <div>
                  <p className="text-lg">
                    Large text (text-lg): Used for emphasized body text,
                    important information, or when you want to create a
                    hierarchy within body text.
                  </p>
                </div>
              </div>
            </StyleSection>

            <StyleSection
              title="Font Weights"
              description="Available font weight variants"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xl font-thin">Font Weight: Thin (100)</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-thin
                  </p>
                </div>
                <div>
                  <p className="text-xl font-extralight">
                    Font Weight: Extra Light (200)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-extralight
                  </p>
                </div>
                <div>
                  <p className="text-xl font-light">Font Weight: Light (300)</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-light
                  </p>
                </div>
                <div>
                  <p className="text-xl font-normal">
                    Font Weight: Normal (400)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-normal
                  </p>
                </div>
                <div>
                  <p className="text-xl font-medium">
                    Font Weight: Medium (500)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-medium
                  </p>
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    Font Weight: Semibold (600)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-semibold
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold">Font Weight: Bold (700)</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-bold
                  </p>
                </div>
                <div>
                  <p className="text-xl font-extrabold">
                    Font Weight: Extra Bold (800)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-extrabold
                  </p>
                </div>
                <div>
                  <p className="text-xl font-black">Font Weight: Black (900)</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    font-black
                  </p>
                </div>
              </div>
            </StyleSection>
          </TabsContent>

          <TabsContent value="colors" className="space-y-8">
            <StyleSection
              title="Primary Colors"
              description="Main colors used in the application"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ColorSwatch
                  name="background"
                  class="bg-background"
                  textClass="text-foreground"
                />
                <ColorSwatch
                  name="foreground"
                  class="bg-foreground"
                  textClass="text-background"
                />
                <ColorSwatch
                  name="primary"
                  class="bg-primary"
                  textClass="text-primary-foreground"
                />
                <ColorSwatch
                  name="primary-foreground"
                  class="bg-primary-foreground"
                  textClass="text-primary"
                />
                <ColorSwatch
                  name="secondary"
                  class="bg-secondary"
                  textClass="text-secondary-foreground"
                />
                <ColorSwatch
                  name="secondary-foreground"
                  class="bg-secondary-foreground"
                  textClass="text-secondary"
                />
                <ColorSwatch
                  name="muted"
                  class="bg-muted"
                  textClass="text-muted-foreground"
                />
                <ColorSwatch
                  name="muted-foreground"
                  class="bg-muted-foreground"
                  textClass="text-muted"
                />
                <ColorSwatch
                  name="accent"
                  class="bg-accent"
                  textClass="text-accent-foreground"
                />
                <ColorSwatch
                  name="accent-foreground"
                  class="bg-accent-foreground"
                  textClass="text-accent"
                />
                <ColorSwatch
                  name="destructive"
                  class="bg-destructive"
                  textClass="text-destructive-foreground"
                />
                <ColorSwatch
                  name="destructive-foreground"
                  class="bg-destructive-foreground"
                  textClass="text-destructive"
                />
                <ColorSwatch
                  name="card"
                  class="bg-card"
                  textClass="text-card-foreground"
                />
                <ColorSwatch
                  name="card-foreground"
                  class="bg-card-foreground"
                  textClass="text-card"
                />
                <ColorSwatch
                  name="popover"
                  class="bg-popover"
                  textClass="text-popover-foreground"
                />
                <ColorSwatch
                  name="popover-foreground"
                  class="bg-popover-foreground"
                  textClass="text-popover"
                />
                <ColorSwatch
                  name="border"
                  class="bg-border"
                  textClass="text-foreground"
                />
                <ColorSwatch
                  name="input"
                  class="bg-input"
                  textClass="text-foreground"
                />
                <ColorSwatch
                  name="ring"
                  class="bg-ring"
                  textClass="text-background"
                />
              </div>
            </StyleSection>

            <StyleSection
              title="Chart Colors"
              description="Colors used for charts and data visualization"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ColorSwatch
                  name="chart-1"
                  class="bg-[hsl(var(--chart-1))]"
                  textClass="text-background"
                  cssVar="--chart-1"
                />
                <ColorSwatch
                  name="chart-2"
                  class="bg-[hsl(var(--chart-2))]"
                  textClass="text-background"
                  cssVar="--chart-2"
                />
                <ColorSwatch
                  name="chart-3"
                  class="bg-[hsl(var(--chart-3))]"
                  textClass="text-background"
                  cssVar="--chart-3"
                />
                <ColorSwatch
                  name="chart-4"
                  class="bg-[hsl(var(--chart-4))]"
                  textClass="text-background"
                  cssVar="--chart-4"
                />
                <ColorSwatch
                  name="chart-5"
                  class="bg-[hsl(var(--chart-5))]"
                  textClass="text-background"
                  cssVar="--chart-5"
                />
              </div>
            </StyleSection>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-8">
            <StyleSection
              title="Button Variants"
              description="Different styles of buttons"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 items-center">
                  <Button variant="default">Default</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    variant="default"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button variant="destructive">Destructive</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    variant="destructive"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button variant="outline">Outline</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    variant="outline"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button variant="secondary">Secondary</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    variant="secondary"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button variant="ghost">Ghost</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    variant="ghost"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button variant="link">Link</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    variant="link"
                  </p>
                </div>
              </div>
            </StyleSection>

            <StyleSection
              title="Button Sizes"
              description="Different sizes of buttons"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 items-center">
                  <Button size="default">Default</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    size="default"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button size="sm">Small</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    size="sm"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button size="lg">Large</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    size="lg"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    size="icon"
                  </p>
                </div>
              </div>
            </StyleSection>

            <StyleSection
              title="Button States"
              description="Different states of buttons"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 items-center">
                  <Button>Normal</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Normal state
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button disabled>Disabled</Button>
                  <p className="text-sm text-muted-foreground mt-1">disabled</p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button className="opacity-50 cursor-not-allowed">
                    Inactive
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    className="opacity-50"
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Button className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                    <span className="opacity-0">Loading</span>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Loading state
                  </p>
                </div>
              </div>
            </StyleSection>
          </TabsContent>

          <TabsContent value="cards" className="space-y-8">
            <StyleSection
              title="Card Variants"
              description="Different styles of cards"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>
                      A simple card with only a header
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card with Content</CardTitle>
                    <CardDescription>
                      A card with header and content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      This is the main content area of the card where the
                      primary information is displayed.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Full Card</CardTitle>
                    <CardDescription>
                      A card with header, content, and footer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      This card demonstrates the complete structure with all
                      sections.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost">Cancel</Button>
                    <Button>Save</Button>
                  </CardFooter>
                </Card>

                <Card className="border-primary">
                  <CardHeader className="bg-primary/5">
                    <CardTitle>Highlighted Card</CardTitle>
                    <CardDescription>
                      A card with custom styling
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      This card has custom border and header styling to make it
                      stand out.
                    </p>
                  </CardContent>
                  <CardFooter className="bg-primary/5">
                    <Button className="w-full">Action</Button>
                  </CardFooter>
                </Card>
              </div>
            </StyleSection>
          </TabsContent>

          <TabsContent value="forms" className="space-y-8">
            <StyleSection
              title="Form Elements"
              description="UI components for forms"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Input</CardTitle>
                    <CardDescription>Text input field</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label
                        htmlFor="default-input"
                        className="block text-sm font-medium mb-1"
                      >
                        Default Input
                      </label>
                      <input
                        id="default-input"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type something..."
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="disabled-input"
                        className="block text-sm font-medium mb-1"
                      >
                        Disabled Input
                      </label>
                      <input
                        id="disabled-input"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Disabled input"
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="with-icon"
                        className="block text-sm font-medium mb-1"
                      >
                        Input with Icon
                      </label>
                      <div className="relative">
                        <input
                          id="with-icon"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Search..."
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Select & Textarea</CardTitle>
                    <CardDescription>
                      Dropdown and multi-line inputs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label
                        htmlFor="select"
                        className="block text-sm font-medium mb-1"
                      >
                        Select
                      </label>
                      <select
                        id="select"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" disabled selected>
                          Select an option
                        </option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="textarea"
                        className="block text-sm font-medium mb-1"
                      >
                        Textarea
                      </label>
                      <textarea
                        id="textarea"
                        className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type your message here..."
                      ></textarea>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Checkbox & Radio</CardTitle>
                    <CardDescription>Selection inputs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Checkboxes
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="checkbox1"
                              className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                            />
                            <label htmlFor="checkbox1" className="text-sm">
                              Option 1
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="checkbox2"
                              className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                              checked
                              readOnly
                            />
                            <label htmlFor="checkbox2" className="text-sm">
                              Option 2 (checked)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="checkbox3"
                              className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                              disabled
                            />
                            <label
                              htmlFor="checkbox3"
                              className="text-sm text-muted-foreground"
                            >
                              Option 3 (disabled)
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Radio Buttons
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="radio1"
                              name="radio-group"
                              className="w-4 h-4 border-input text-primary focus:ring-primary"
                            />
                            <label htmlFor="radio1" className="text-sm">
                              Option 1
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="radio2"
                              name="radio-group"
                              className="w-4 h-4 border-input text-primary focus:ring-primary"
                              checked
                              readOnly
                            />
                            <label htmlFor="radio2" className="text-sm">
                              Option 2 (selected)
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="radio3"
                              name="radio-group"
                              className="w-4 h-4 border-input text-primary focus:ring-primary"
                              disabled
                            />
                            <label
                              htmlFor="radio3"
                              className="text-sm text-muted-foreground"
                            >
                              Option 3 (disabled)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Switch & Slider</CardTitle>
                    <CardDescription>Toggle and range inputs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Toggle Switches
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                            <span className="inline-block h-5 w-5 rounded-full bg-background shadow-lg transform ring-0 transition duration-200 translate-x-0"></span>
                          </div>
                          <label className="text-sm">Off</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                            <span className="inline-block h-5 w-5 rounded-full bg-background shadow-lg transform ring-0 transition duration-200 translate-x-5"></span>
                          </div>
                          <label className="text-sm">On</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background opacity-50">
                            <span className="inline-block h-5 w-5 rounded-full bg-background shadow-lg transform ring-0 transition duration-200 translate-x-0"></span>
                          </div>
                          <label className="text-sm text-muted-foreground">
                            Disabled
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="slider" className="text-sm font-medium">
                        Slider
                      </label>
                      <input
                        type="range"
                        id="slider"
                        min="0"
                        max="100"
                        defaultValue="50"
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </StyleSection>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function StyleSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-6 pb-8">
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      {children}
      <Separator className="mt-8" />
    </section>
  );
}

function ColorSwatch({
  name,
  class: className,
  textClass,
  cssVar,
}: {
  name: string;
  class: string;
  textClass: string;
  cssVar?: string;
}) {
  return (
    <div className="flex flex-col">
      <div
        className={`h-24 rounded-lg ${className} flex items-center justify-center`}
      >
        <span className={`text-sm font-medium ${textClass}`}>{name}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {cssVar ? `hsl(var(${cssVar}))` : className}
      </p>
    </div>
  );
}
