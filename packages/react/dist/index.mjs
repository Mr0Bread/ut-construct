"use client";

// src/index.tsx
import { useContext, useEffect as useEffect2, useState, createContext, useCallback as useCallback2, useMemo as useMemo2, useRef as useRef2 } from "react";
import { generateReactHelpers } from "@uploadthing/react/hooks";

// src/use-dropzone/index.tsx
import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from "react";
import { fromEvent } from "file-selector";

// src/use-dropzone/utils.ts
import attrAccepts from "attr-accept";
var accepts = (
  // @ts-expect-error - ESM interop
  typeof attrAccepts === "function" ? attrAccepts : attrAccepts.default
);
var ErrorCode = {
  FILE_INVALID_TYPE: "FILE_INVALID_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_TOO_SMALL: "FILE_TOO_SMALL",
  TOO_MANY_FILES: "TOO_MANY_FILES"
};
var getInvalidTypeRejectionErr = (accept) => {
  accept = Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
  const messageSuffix = Array.isArray(accept) ? `one of ${accept.join(", ")}` : accept;
  return {
    code: ErrorCode.FILE_INVALID_TYPE,
    message: `File type must be ${messageSuffix}`
  };
};
var getTooLargeRejectionErr = (maxSize) => {
  return {
    code: ErrorCode.FILE_TOO_LARGE,
    message: `File is larger than ${maxSize} ${maxSize === 1 ? "byte" : "bytes"}`
  };
};
var getTooSmallRejectionErr = (minSize) => {
  return {
    code: ErrorCode.FILE_TOO_SMALL,
    message: `File is smaller than ${minSize} ${minSize === 1 ? "byte" : "bytes"}`
  };
};
function fileAccepted(file, accept) {
  const isAcceptable = file.type === "application/x-moz-file" || accepts(file, accept);
  return [
    isAcceptable,
    isAcceptable ? null : getInvalidTypeRejectionErr(accept)
  ];
}
function fileMatchSize(file, minSize, maxSize) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize)
        return [false, getTooLargeRejectionErr(maxSize)];
      if (file.size < minSize)
        return [false, getTooSmallRejectionErr(minSize)];
    } else if (isDefined(minSize) && file.size < minSize)
      return [false, getTooSmallRejectionErr(minSize)];
    else if (isDefined(maxSize) && file.size > maxSize)
      return [false, getTooLargeRejectionErr(maxSize)];
  }
  return [true, null];
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function allFilesAccepted({
  files,
  accept,
  minSize,
  maxSize,
  multiple,
  maxFiles,
  validator
}) {
  if (!multiple && files.length > 1 || multiple && maxFiles >= 1 && files.length > maxFiles) {
    return false;
  }
  return files.every((file) => {
    const [accepted] = fileAccepted(file, accept);
    const [sizeMatch] = fileMatchSize(file, minSize, maxSize);
    const customErrors = validator ? validator(file) : null;
    return accepted && sizeMatch && !customErrors;
  });
}
function isPropagationStopped(event) {
  if ("isPropagationStopped" in event && typeof event.isPropagationStopped === "function") {
    return event.isPropagationStopped();
  } else if ("cancelBubble" in event && typeof event.cancelBubble !== "undefined") {
    return event.cancelBubble;
  }
  return false;
}
function isEvtWithFiles(event) {
  if (!("dataTransfer" in event && event.dataTransfer !== null)) {
    return !!event.target && "files" in event.target && !!event.target.files;
  }
  return Array.prototype.some.call(
    event.dataTransfer.types,
    (type) => type === "Files" || type === "application/x-moz-file"
  );
}
function onDocumentDragOver(event) {
  event.preventDefault();
}
function isIe(userAgent) {
  return userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1;
}
function isEdge(userAgent) {
  return userAgent.indexOf("Edge/") !== -1;
}
function isIeOrEdge(userAgent = window.navigator.userAgent) {
  return isIe(userAgent) || isEdge(userAgent);
}
function composeEventHandlers(...fns) {
  return (event, ...args) => fns.some((fn) => {
    if (!isPropagationStopped(event) && fn) {
      fn(event, ...args);
    }
    return isPropagationStopped(event);
  });
}
function canUseFileSystemAccessAPI() {
  return "showOpenFilePicker" in window;
}
function pickerOptionsFromAccept(accept) {
  if (isDefined(accept)) {
    const acceptForPicker = Object.entries(accept).filter(([mimeType, ext]) => {
      let ok = true;
      if (!isMIMEType(mimeType)) {
        console.warn(
          `Skipped "${mimeType}" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.`
        );
        ok = false;
      }
      if (!Array.isArray(ext) || !ext.every(isExt)) {
        console.warn(
          `Skipped "${mimeType}" because an invalid file extension was provided.`
        );
        ok = false;
      }
      return ok;
    }).reduce(
      (agg, [mimeType, ext]) => ({
        ...agg,
        [mimeType]: ext
      }),
      {}
    );
    return [
      {
        // description is required due to https://crbug.com/1264708
        description: "Files",
        accept: acceptForPicker
      }
    ];
  }
  return accept;
}
function acceptPropAsAcceptAttr(accept) {
  if (isDefined(accept)) {
    return Object.entries(accept).reduce((a, [mimeType, ext]) => [...a, mimeType, ...ext], []).filter((v) => isMIMEType(v) || isExt(v)).join(",");
  }
  return void 0;
}
function isAbort(v) {
  return v instanceof DOMException && (v.name === "AbortError" || v.code === v.ABORT_ERR);
}
function isSecurityError(v) {
  return v instanceof DOMException && (v.name === "SecurityError" || v.code === v.SECURITY_ERR);
}
function isMIMEType(v) {
  return v === "audio/*" || v === "video/*" || v === "image/*" || v === "text/*" || /\w+\/[-+.\w]+/g.test(v);
}
function isExt(v) {
  return /^.*\.[\w]+$/.test(v);
}

// src/use-dropzone/index.tsx
var initialState = {
  isFocused: false,
  isFileDialogActive: false,
  isDragActive: false,
  isDragAccept: false,
  isDragReject: false,
  acceptedFiles: [],
  fileRejections: [],
  rootRef: createRef(),
  inputRef: createRef()
};
function useDropzone(props) {
  const {
    accept,
    disabled = false,
    getFilesFromEvent = fromEvent,
    maxSize = Number.POSITIVE_INFINITY,
    minSize = 0,
    multiple = true,
    maxFiles = 0,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onDropAccepted,
    onDropRejected,
    onFileDialogCancel,
    onFileDialogOpen,
    useFsAccessApi,
    autoFocus,
    preventDropOnDocument = true,
    noClick = false,
    noKeyboard = false,
    noDrag = false,
    noDragEventsBubbling = false,
    onError,
    validator = null
  } = props;
  const acceptAttr = useMemo(() => acceptPropAsAcceptAttr(accept), [accept]);
  const pickerTypes = useMemo(() => pickerOptionsFromAccept(accept), [accept]);
  const onFileDialogOpenCb = useMemo(
    () => typeof onFileDialogOpen === "function" ? onFileDialogOpen : noop,
    [onFileDialogOpen]
  );
  const onFileDialogCancelCb = useMemo(
    () => typeof onFileDialogCancel === "function" ? onFileDialogCancel : noop,
    [onFileDialogCancel]
  );
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isFocused, isFileDialogActive } = state;
  const fsAccessApiWorksRef = useRef(
    typeof window !== "undefined" && window.isSecureContext && useFsAccessApi && canUseFileSystemAccessAPI()
  );
  const onWindowFocus = () => {
    if (!fsAccessApiWorksRef.current && isFileDialogActive) {
      setTimeout(() => {
        if (inputRef.current) {
          const { files } = inputRef.current;
          if (!(files == null ? void 0 : files.length)) {
            dispatch({ type: "closeDialog" });
            onFileDialogCancelCb();
          }
        }
      }, 300);
    }
  };
  useEffect(() => {
    window.addEventListener("focus", onWindowFocus, false);
    return () => {
      window.removeEventListener("focus", onWindowFocus, false);
    };
  }, [inputRef, isFileDialogActive, onFileDialogCancelCb, fsAccessApiWorksRef]);
  const dragTargetsRef = useRef([]);
  const onDocumentDrop = (event) => {
    var _a;
    if ((_a = rootRef.current) == null ? void 0 : _a.contains(event.target)) {
      return;
    }
    event.preventDefault();
    dragTargetsRef.current = [];
  };
  useEffect(() => {
    if (preventDropOnDocument) {
      document.addEventListener("dragover", onDocumentDragOver, false);
      document.addEventListener("drop", onDocumentDrop, false);
    }
    return () => {
      if (preventDropOnDocument) {
        document.removeEventListener("dragover", onDocumentDragOver);
        document.removeEventListener("drop", onDocumentDrop);
      }
    };
  }, [rootRef, preventDropOnDocument]);
  useEffect(() => {
    if (!disabled && autoFocus && rootRef.current) {
      rootRef.current.focus();
    }
    return noop;
  }, [rootRef, autoFocus, disabled]);
  const onErrCb = useCallback(
    (e) => {
      if (onError) {
        onError(e);
      } else {
        console.error(e);
      }
    },
    [onError]
  );
  const onDragEnterCb = useCallback(
    (event) => {
      event.preventDefault();
      event.persist();
      stopPropagation(event);
      dragTargetsRef.current = [...dragTargetsRef.current, event.target];
      if (isEvtWithFiles(event)) {
        Promise.resolve(getFilesFromEvent(event)).then((files) => {
          if (isPropagationStopped(event) && !noDragEventsBubbling) {
            return;
          }
          const fileCount = files.length;
          const isDragAccept = fileCount > 0 && allFilesAccepted({
            files,
            accept: acceptAttr,
            minSize,
            maxSize,
            multiple,
            maxFiles,
            validator
          });
          const isDragReject = fileCount > 0 && !isDragAccept;
          dispatch({
            type: "setDraggedFiles",
            payload: {
              isDragAccept,
              isDragReject,
              isDragActive: true
            }
          });
          if (onDragEnter) {
            onDragEnter(event);
          }
        }).catch(onErrCb);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      getFilesFromEvent,
      onDragEnter,
      onErrCb,
      noDragEventsBubbling,
      acceptAttr,
      minSize,
      maxSize,
      multiple,
      maxFiles,
      validator
    ]
  );
  const onDragOverCb = useCallback(
    (event) => {
      event.preventDefault();
      event.persist();
      stopPropagation(event);
      const hasFiles = isEvtWithFiles(event);
      if (hasFiles && "dataTransfer" in event && event.dataTransfer !== null) {
        try {
          event.dataTransfer.dropEffect = "copy";
        } catch {
        }
      }
      if (hasFiles && onDragOver) {
        onDragOver(event);
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDragOver, noDragEventsBubbling]
  );
  const onDragLeaveCb = useCallback(
    (event) => {
      event.preventDefault();
      event.persist();
      stopPropagation(event);
      const targets = dragTargetsRef.current.filter(
        (target) => {
          var _a;
          return (_a = rootRef.current) == null ? void 0 : _a.contains(target);
        }
      );
      const targetIdx = targets.indexOf(event.target);
      if (targetIdx !== -1) {
        targets.splice(targetIdx, 1);
      }
      dragTargetsRef.current = targets;
      if (targets.length > 0) {
        return;
      }
      dispatch({
        type: "setDraggedFiles",
        payload: {
          isDragActive: false,
          isDragAccept: false,
          isDragReject: false
        }
      });
      if (isEvtWithFiles(event) && onDragLeave) {
        onDragLeave(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rootRef, onDragLeave, noDragEventsBubbling]
  );
  const setFiles = useCallback(
    (files, event) => {
      const acceptedFiles = [];
      const fileRejections = [];
      files.forEach((file) => {
        const [accepted, acceptError] = fileAccepted(file, acceptAttr);
        const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);
        const customErrors = validator ? validator(file) : null;
        if (accepted && sizeMatch && !customErrors) {
          acceptedFiles.push(file);
        } else {
          let errors = [acceptError, sizeError];
          if (customErrors) {
            errors = errors.concat(customErrors);
          }
          fileRejections.push({
            file,
            errors: errors.filter((e) => !!e)
          });
        }
      });
      if (!multiple && acceptedFiles.length > 1 || multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles) {
        acceptedFiles.forEach((file) => {
          fileRejections.push({
            file,
            errors: [
              { code: ErrorCode.TOO_MANY_FILES, message: "Too many files" }
            ]
          });
        });
        acceptedFiles.splice(0);
      }
      dispatch({
        type: "setFiles",
        payload: {
          acceptedFiles,
          fileRejections
        }
      });
      if (onDrop) {
        onDrop(acceptedFiles, fileRejections, event);
      }
      if (fileRejections.length > 0 && onDropRejected) {
        onDropRejected(fileRejections, event);
      }
      if (acceptedFiles.length > 0 && onDropAccepted) {
        onDropAccepted(acceptedFiles, event);
      }
    },
    [
      dispatch,
      multiple,
      acceptAttr,
      minSize,
      maxSize,
      maxFiles,
      onDrop,
      onDropAccepted,
      onDropRejected,
      validator
    ]
  );
  const onDropCb = useCallback(
    (event) => {
      event.preventDefault();
      event.persist();
      stopPropagation(event);
      dragTargetsRef.current = [];
      if (isEvtWithFiles(event)) {
        Promise.resolve(getFilesFromEvent(event)).then((files) => {
          if (isPropagationStopped(event) && !noDragEventsBubbling) {
            return;
          }
          setFiles(files, event);
        }).catch(onErrCb);
      }
      dispatch({ type: "reset" });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getFilesFromEvent, setFiles, onErrCb, noDragEventsBubbling]
  );
  const openFileDialog = useCallback(() => {
    if (fsAccessApiWorksRef.current) {
      dispatch({ type: "openDialog" });
      onFileDialogOpenCb();
      const opts = {
        multiple,
        types: pickerTypes
      };
      window.showOpenFilePicker(opts).then((handles) => getFilesFromEvent(handles)).then((files) => {
        setFiles(files, null);
        dispatch({ type: "closeDialog" });
      }).catch((e) => {
        if (isAbort(e)) {
          onFileDialogCancelCb();
          dispatch({ type: "closeDialog" });
        } else if (isSecurityError(e)) {
          fsAccessApiWorksRef.current = false;
          if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.click();
          } else {
            onErrCb(
              new Error(
                "Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."
              )
            );
          }
        } else {
          onErrCb(e);
        }
      });
      return;
    }
    if (inputRef.current) {
      dispatch({ type: "openDialog" });
      onFileDialogOpenCb();
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }, [
    dispatch,
    onFileDialogOpenCb,
    onFileDialogCancelCb,
    useFsAccessApi,
    setFiles,
    onErrCb,
    pickerTypes,
    multiple
  ]);
  const onKeyDownCb = useCallback(
    (event) => {
      var _a;
      if (!((_a = rootRef.current) == null ? void 0 : _a.isEqualNode(event.target))) {
        return;
      }
      if ("key" in event && (event.key === " " || event.key === "Enter") || "keyCode" in event && (event.keyCode === 32 || event.keyCode === 13)) {
        event.preventDefault();
        openFileDialog();
      }
    },
    [rootRef, openFileDialog]
  );
  const onFocusCb = useCallback(() => {
    dispatch({ type: "focus" });
  }, []);
  const onBlurCb = useCallback(() => {
    dispatch({ type: "blur" });
  }, []);
  const onClickCb = useCallback(() => {
    if (noClick) {
      return;
    }
    if (isIeOrEdge()) {
      setTimeout(openFileDialog, 0);
    } else {
      openFileDialog();
    }
  }, [noClick, openFileDialog]);
  const composeHandler = (fn) => {
    return disabled ? null : fn;
  };
  const composeKeyboardHandler = (fn) => {
    return noKeyboard ? null : composeHandler(fn);
  };
  const composeDragHandler = (fn) => {
    return noDrag ? null : composeHandler(fn);
  };
  const stopPropagation = (event) => {
    if (noDragEventsBubbling) {
      event.stopPropagation();
    }
  };
  const getRootProps = useMemo(
    () => (
      // @ts-expect-error - FIXME LATER
      ({
        refKey = "ref",
        role,
        onKeyDown,
        onFocus,
        onBlur,
        onClick,
        onDragEnter: onDragEnter2,
        onDragOver: onDragOver2,
        onDragLeave: onDragLeave2,
        onDrop: onDrop2,
        ...rest
      } = {}) => ({
        onKeyDown: composeKeyboardHandler(
          composeEventHandlers(onKeyDown, onKeyDownCb)
        ),
        onFocus: composeKeyboardHandler(
          composeEventHandlers(onFocus, onFocusCb)
        ),
        onBlur: composeKeyboardHandler(composeEventHandlers(onBlur, onBlurCb)),
        onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
        onDragEnter: composeDragHandler(
          composeEventHandlers(onDragEnter2, onDragEnterCb)
        ),
        onDragOver: composeDragHandler(
          composeEventHandlers(onDragOver2, onDragOverCb)
        ),
        onDragLeave: composeDragHandler(
          composeEventHandlers(onDragLeave2, onDragLeaveCb)
        ),
        onDrop: composeDragHandler(composeEventHandlers(onDrop2, onDropCb)),
        role: typeof role === "string" && role !== "" ? role : "presentation",
        [refKey]: rootRef,
        ...!disabled && !noKeyboard ? { tabIndex: 0 } : {},
        ...rest
      })
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      rootRef,
      onKeyDownCb,
      onFocusCb,
      onBlurCb,
      onClickCb,
      onDragEnterCb,
      onDragOverCb,
      onDragLeaveCb,
      onDropCb,
      noKeyboard,
      noDrag,
      disabled
    ]
  );
  const onInputElementClick = useCallback((event) => {
    event.stopPropagation();
  }, []);
  const getInputProps = useMemo(
    () => (
      // @ts-expect-error - FIXME LATER
      ({ refKey = "ref", onChange, onClick, ...rest } = {}) => ({
        accept: acceptAttr,
        multiple,
        type: "file",
        style: { display: "none" },
        onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
        onClick: composeHandler(
          composeEventHandlers(onClick, onInputElementClick)
        ),
        tabIndex: -1,
        [refKey]: inputRef,
        ...rest
      })
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputRef, accept, multiple, onDropCb, disabled]
  );
  const returnResult = useMemo(
    () => ({
      ...state,
      isFocused: isFocused && !disabled,
      getRootProps,
      getInputProps,
      rootRef,
      inputRef,
      open: composeHandler(openFileDialog)
    }),
    [
      isFocused,
      disabled,
      getRootProps,
      getInputProps,
      rootRef,
      inputRef,
      composeHandler(openFileDialog),
      state
    ]
  );
  return returnResult;
}
function reducer(state, action) {
  switch (action.type) {
    case "focus":
      return {
        ...state,
        isFocused: true
      };
    case "blur":
      return {
        ...state,
        isFocused: false
      };
    case "openDialog":
      return {
        ...initialState,
        isFileDialogActive: true
      };
    case "closeDialog":
      return {
        ...state,
        isFileDialogActive: false
      };
    case "setDraggedFiles":
      return {
        ...state,
        ...action.payload
      };
    case "setFiles":
      return {
        ...state,
        ...action.payload
      };
    case "reset":
      return {
        ...initialState
      };
    default:
      return state;
  }
}
function noop() {
}

// src/index.tsx
import { allowedContentTextLabelGenerator, generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { twMerge } from "tailwind-merge";
import { jsx, jsxs } from "react/jsx-runtime";
function getFilesFromClipboardEvent(event) {
  var _a;
  const dataTransferItems = (_a = event.clipboardData) == null ? void 0 : _a.items;
  if (!dataTransferItems)
    return;
  const files = Array.from(dataTransferItems).reduce((acc, curr) => {
    const f = curr.getAsFile();
    return f ? [...acc, f] : acc;
  }, []);
  return files;
}
var generateConstruct = () => {
  const {
    useUploadThing
  } = generateReactHelpers();
  const RootContext = createContext(
    {}
  );
  RootContext.displayName = "UtConstructContext";
  const DropzoneRoot = ({
    children,
    render,
    className,
    appearance
  }) => {
    const context = useContext(RootContext);
    const {
      setDropzoneHelpers,
      setFiles,
      fileTypes,
      isReady,
      allowedContentTextLabel,
      files
    } = context;
    const defaultOnDrop = useCallback2(
      (acceptedFiles) => {
        setFiles(acceptedFiles);
      },
      [setFiles]
    );
    const accept = useMemo2(
      () => fileTypes ? generateClientDropzoneAccept(fileTypes) : void 0,
      // shitty code? maybe. It works? yes. Am I proud of myself? Hell yeah
      // It is so that I don't need to bother with reference to array but compare actual values
      [fileTypes.join(";")]
    );
    const dropzoneProps = useMemo2(
      () => {
        return {
          onDrop: defaultOnDrop,
          accept
        };
      },
      [defaultOnDrop, accept]
    );
    const dropzone = useDropzone(dropzoneProps);
    useEffect2(
      () => {
        setDropzoneHelpers(dropzone);
      },
      [dropzone]
    );
    const getDefaultClasses = () => {
      const defaultClasses = "mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center hover:bg-gray-100 transition-colors";
      return defaultClasses;
    };
    if (render)
      return render({
        ...context,
        getDefaultClasses,
        getRootProps: dropzone.getRootProps
      });
    if (children) {
      return /* @__PURE__ */ jsx(
        "div",
        {
          ...dropzone.getRootProps(),
          className: twMerge(
            getDefaultClasses(),
            className
          ),
          children
        }
      );
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ...dropzone.getRootProps(),
        className: twMerge(
          getDefaultClasses(),
          className
        ),
        children: [
          /* @__PURE__ */ jsx(DropzoneInput, {}),
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 20 20",
              className: "mx-auto block h-12 w-12 align-middle text-gray-400",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  fill: "currentColor",
                  fillRule: "evenodd",
                  d: "M5.5 17a4.5 4.5 0 0 1-1.44-8.765a4.5 4.5 0 0 1 8.302-3.046a3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z",
                  clipRule: "evenodd"
                }
              )
            }
          ),
          isReady ? "Choose files or drag and drop" : "Loading...",
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "m-0 min-h-[1.25rem] text-xs leading-5 text-gray-600",
              children: allowedContentTextLabel
            }
          ),
          (appearance == null ? void 0 : appearance.noBtn) ? null : files.length > 0 ? /* @__PURE__ */ jsx(UploadTrigger, {}) : null
        ]
      }
    );
  };
  const DropzoneInput = () => {
    const {
      dropzoneHelpers
    } = useContext(RootContext);
    return /* @__PURE__ */ jsx("input", { className: "sr-only", ...dropzoneHelpers == null ? void 0 : dropzoneHelpers.getInputProps() });
  };
  const UploadTrigger = ({
    render,
    children,
    className
  }) => {
    const context = useContext(RootContext);
    const {
      startUpload,
      input,
      files,
      isUploading,
      multiple,
      isReady
    } = context;
    const defaultOnClick = useCallback2(
      () => {
        if (!files.length)
          return;
        return startUpload(files, input);
      },
      [startUpload, files, input]
    );
    const getDefaultButtonText = () => {
      if (files.length)
        return `Upload ${files.length} file${files.length === 1 ? "" : "s"}`;
      if (!isReady)
        return "Loading...";
      if (isUploading)
        return "Uploading";
      return `Choose File${multiple ? `(s)` : ``}`;
    };
    const getDefaultClasses = () => {
      const defaultClasses = "relative mt-4 flex h-10 w-36 items-center justify-center overflow-hidden rounded-md text-white after:transition-[width] after:duration-500 bg-blue-600 border-none cursor-pointer hover:bg-blue-500 transition-colors";
      if (!isReady) {
        return twMerge(
          defaultClasses,
          "bg-blue-400 cursor-not-allowed"
        );
      }
      return defaultClasses;
    };
    if (render)
      return render({
        ...context,
        onClick: defaultOnClick,
        getDefaultButtonText,
        getDefaultClasses
      });
    if (children)
      return /* @__PURE__ */ jsx("button", { children });
    return /* @__PURE__ */ jsx(
      "button",
      {
        className: twMerge(
          getDefaultClasses(),
          className
        ),
        onClick: defaultOnClick,
        children: getDefaultButtonText()
      }
    );
  };
  const FilePreviewCard = ({ file }) => {
    const {
      files,
      setFiles
    } = useContext(RootContext);
    const [isHovered, setIsHovered] = useState(false);
    const onMouseEnter = () => {
      setIsHovered(true);
    };
    const onMouseLeave = () => {
      setIsHovered(false);
    };
    const defaultOnClick = () => {
      setFiles(
        files.filter(
          (f) => f !== file
        )
      );
    };
    const getDefaultClasses = () => {
      const defaultClasses = "relative border border-gray-300 rounded cursor-pointer after:content-[''] after:absolute after:w-full after:h-full after:top-0 after:left-0 after:transition-colors";
      if (isHovered) {
        return twMerge(
          defaultClasses,
          "after:bg-gray-400/25"
        );
      }
      return defaultClasses;
    };
    const closeIcon = /* @__PURE__ */ jsx(
      "svg",
      {
        fill: "#000000",
        height: "36px",
        width: "36",
        version: "1.1",
        id: "Layer_1",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 512 512",
        className: "",
        children: /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx("polygon", { points: "512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512 \n               512,452.922 315.076,256 		" }) }) })
      }
    );
    const renderCloseIcon = () => {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: twMerge(
            "opacity-0 transition-opacity absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur w-full h-full flex justify-center items-center",
            isHovered ? "opacity-100" : null
          ),
          children: closeIcon
        }
      );
    };
    const isImage = file.type.includes("image");
    if (isImage) {
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: getDefaultClasses(),
          onMouseEnter,
          onMouseLeave,
          onClick: defaultOnClick,
          children: [
            renderCloseIcon(),
            /* @__PURE__ */ jsx(
              "img",
              {
                className: "w-[80px]",
                src: URL.createObjectURL(file),
                alt: `preview of ${file.name}`
              }
            )
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: twMerge(
          getDefaultClasses(),
          "min-w-[80px] min-h-[80px] p-3"
        ),
        onMouseEnter,
        onMouseLeave,
        onClick: defaultOnClick,
        children: [
          renderCloseIcon(),
          file.name
        ]
      }
    );
  };
  const FileGallery = ({
    render
  }) => {
    const context = useContext(RootContext);
    const {
      files
    } = context;
    if (!files.length)
      return null;
    const getDefaultClasses = () => {
      const defaultClasses = "mt-4 flex flex-row gap-x-4";
      return defaultClasses;
    };
    const renderFile = (file) => {
      return /* @__PURE__ */ jsx(FilePreviewCard, { file });
    };
    if (render)
      return render({
        ...context,
        getDefaultClasses,
        renderFile
      });
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: getDefaultClasses(),
        children: files.map(renderFile)
      }
    );
  };
  const Textarea = (props) => {
    const elemRef = useRef2(null);
    const {
      files,
      setFiles
    } = useContext(RootContext);
    useEffect2(
      () => {
        const handlePaste = (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (document.activeElement !== elemRef.current) {
            return;
          }
          const pastedFiles = getFilesFromClipboardEvent(event);
          if (!pastedFiles)
            return;
          setFiles([...files, ...pastedFiles]);
        };
        window.addEventListener("paste", handlePaste);
        return () => {
          window.removeEventListener("paste", handlePaste);
        };
      }
    );
    const getDefaultClasses = () => {
      const defaultClasses = "block p-2.5 w-full text-base text-gray-900 border rounded";
      return defaultClasses;
    };
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        placeholder: "Write your text here",
        ...props,
        ref: elemRef,
        className: twMerge(
          getDefaultClasses(),
          props.className
        )
      }
    );
  };
  const UploadRoot = (props) => {
    const $props = props;
    const {
      endpoint,
      onClientUploadComplete,
      onUploadBegin,
      onUploadError,
      onUploadProgress,
      children
    } = $props;
    const input = "input" in $props ? $props.input : void 0;
    const [droppedFiles, setDroppedFiles] = useState([]);
    const [dropzoneHelpers, setDropzoneHelpers] = useState();
    const {
      isUploading,
      startUpload,
      permittedFileInfo
    } = useUploadThing(
      endpoint
    );
    const {
      fileTypes,
      multiple
    } = generatePermittedFileTypes(
      permittedFileInfo == null ? void 0 : permittedFileInfo.config
    );
    const allowedContentTextLabel = allowedContentTextLabelGenerator(permittedFileInfo == null ? void 0 : permittedFileInfo.config);
    const isReady = fileTypes.length > 0;
    return /* @__PURE__ */ jsx(RootContext.Provider, { value: {
      endpoint: $props.endpoint,
      files: droppedFiles,
      setFiles: setDroppedFiles,
      startUpload,
      isUploading,
      setDropzoneHelpers,
      dropzoneHelpers,
      input,
      fileTypes,
      multiple,
      isReady,
      allowedContentTextLabel
    }, children });
  };
  return {
    UploadRoot,
    UploadTrigger,
    DropzoneRoot,
    DropzoneInput,
    RootContext,
    Textarea,
    FileGallery
  };
};
export {
  generateConstruct
};
//# sourceMappingURL=index.mjs.map