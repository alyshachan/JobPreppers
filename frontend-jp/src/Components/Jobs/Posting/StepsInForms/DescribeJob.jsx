import { useFormContext } from "react-hook-form";
import { DialogContent, TextField, IconButton } from "@mui/material";
import AutoCompleteForm from "../Helper/AutoCompleteForm";
import styles from "../Posting.module.css";
import { errorMessage } from "../Helper/ErrorMessage";
import axios from "axios";
import { useEditor, FloatingMenu, BubbleMenu } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapEditor from "../Helper/TipTapEditor";
import { Placeholder } from "@tiptap/extension-placeholder";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import LinkIcon from "@mui/icons-material/Link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import React, { useCallback } from "react";

export default function DescribeJob({ formData, setFormData }) {
  const jobForm = useFormContext();
  const onSubmit = (data) => {
    console.log(data);
    setFormData({ ...formData, ...data });
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = jobForm;

  const description = watch("description", "");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign,
      Placeholder.configure({
        placeholder: "Start Typing Here..",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
    ],
    content: watch("description"), // Keep value in sync
    onUpdate: ({ editor }) => {
      setValue("description", editor.getHTML(), { shouldValidate: true }); // Update form value
    },
    editorProps: {
      attributes: {
        class: styles.textEditor,
      },
    },
  });

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert(e.message);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const submitAddress = async (location) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json`;

    if (!location) {
      alert("Please enter a location.");
      return;
    }
    try {
      const response = await axios.get(url);
      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        console.log("No results found for the location");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const employementTypeOptions = [
    { value: 1, label: "Full-Time" },
    { value: 2, label: "Part-Time" },
    { value: 3, label: "Internship" },
    { value: 4, label: "PRN" },
    { value: 5, label: "Apprentices" },
  ];

  // Step 1

  return (
    <>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className={`${styles.dialogContent} pt-2`}>
              <div className={styles.dialogContentLeft}>
                <div className={styles.input}>
                  <div className={styles.inputField}>
                    <TextField
                      {...register("company")}
                      required
                      type="text"
                      label="Company Name"
                    />
                  </div>
                  {errorMessage(errors.company)}

                  <div className={styles.inputField}>
                    <TextField
                      {...register("title")}
                      required
                      label="Job Title"
                    />
                    {errorMessage(errors.title)}
                  </div>
                </div>
              </div>

              <div className={styles.dialogContentRight}>
                <div className={styles.input}>
                  <div className={styles.inputField}>
                    <TextField
                      {...register("location")}
                      label="Location *"
                      onBlur={async (e) => {
                        const location = e.target.value;
                        try {
                          if (location) {
                            let lower = location.toLowerCase();
                            if (lower.match("remote")) {
                              setValue("latitude", null);
                              setValue("longitude", null);
                            } else {
                              const { lat, lon } = await submitAddress(
                                location
                              );
                              console.log("Fetched coordinates:", lat, lon);
                              if (lat && lon) {
                                setValue("latitude", lat);
                                setValue("longitude", lon);
                              } else {
                                alert("Please enter a correct location");
                              }
                            }
                          }
                        } catch (e) {
                          alert(
                            "Couldn't find the address, please check spelling"
                          );
                        }
                      }}
                    />
                    {errorMessage(errors.location)}
                  </div>
                  <div className={styles.inputField}>
                    <AutoCompleteForm
                      control={control}
                      name="type"
                      options={employementTypeOptions}
                      label="Employment Type *"
                    />
                    {errorMessage(errors.type)}
                  </div>
                </div>
              </div>
            </div>

            <label for="description" className={`${styles.label} mt-[10px]`}>
              Job Description *
            </label>
            <div className={styles.textEditorContainer}>
              <div className={styles.toolBar}>
                <IconButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <FormatBoldIcon />
                </IconButton>

                <IconButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <FormatItalicIcon />
                </IconButton>

                <IconButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <FormatUnderlinedIcon />
                </IconButton>

                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <FormatListBulletedIcon />
                </IconButton>

                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  <FormatListNumberedIcon />
                </IconButton>

                <IconButton
                  onClick={() => editor.chain().setTextAlign("justify").focus()}
                >
                  <FormatAlignJustifyIcon />
                </IconButton>

                <IconButton onClick={setLink}>
                  <LinkIcon />
                </IconButton>
              </div>
              <div className={styles.toolbarDivider} />

              <TipTapEditor
                control={control}
                name="description"
                editor={editor}
              >
                {/* <FloatingMenu editor={editor}>
                  This is the floating menu
                </FloatingMenu>
                <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
              </TipTapEditor>
              {errorMessage(errors.description)}
            </div>
          </div>
        </form>
      </DialogContent>
    </>
  );
}
