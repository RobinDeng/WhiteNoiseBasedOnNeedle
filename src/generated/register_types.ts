/* eslint-disable */
import { TypeStore } from "@needle-tools/engine"

// Import types
import { handIdentification } from "../scripts/handGestureIdentification.js";
import { idle } from "../scripts/idleBehaviour.js";

// Register types
TypeStore.add("handIdentification", handIdentification);
TypeStore.add("idle", idle);
