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

export const LaravelCodeVault: React.FC = () => { const [activeTab, setActiveTab] = useState('structure'); const [copiedId, setCopiedId] = useState<string | null>(null); const handleCopy = (id: string, text: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };