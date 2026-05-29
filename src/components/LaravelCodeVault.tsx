/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Code, Database, FolderTree, GitFork, Clipboard, Check, Layers, Sparkles } from 'lucide-react';

interface CodeSnippet {
    id: string;
    name: string;
    path: string;
    lang: string;
    icon: React.ReactNode;
    content: string;
}