'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Script from 'next/script';
import { FaCodeFork } from 'react-icons/fa6';

declare global {
    interface Window {
        cheerpjInit: (options?: any) => Promise<void>;
        cheerpjRunJar: (path: string, args: string) => Promise<void>;
        cheerpjCreateDisplay: (width: number, height: number, parent?: HTMLElement) => Promise<void>;
        cjCall: (className: string, methodName: string, ...args: any[]) => Promise<any>;
    }
}

export default function Java3DEngine() {
    const [status, setStatus] = useState<'loading' | 'ready' | 'running' | 'error'>('loading');
    const [logs, setLogs] = useState<string[]>([]);
    const initialized = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    useEffect(() => {
        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args) => {
            // Filter out React/Next.js noise if needed, but for now capture everything
            // CheerpJ logs usually start with specific prefixes or are just plain text from Java
            addLog(`LOG: ${args.join(' ')}`);
            originalLog.apply(console, args);
        };

        console.error = (...args) => {
            addLog(`ERR: ${args.join(' ')}`);
            originalError.apply(console, args);
        };

        return () => {
            console.log = originalLog;
            console.error = originalError;
        };
    }, []);

    const initCheerpJ = async () => {
        if (initialized.current) return;

        try {
            setStatus('loading');
            addLog('Initializing CheerpJ...');

            if (!window.cheerpjInit) {
                throw new Error('CheerpJ not found');
            }

            await window.cheerpjInit();
            initialized.current = true;
            setStatus('ready');
            addLog('Cheerpj Ready. Creating Display...');

            // Explicitly create display to avoid NPE
            if (window.cheerpjCreateDisplay) {
                // Try to create display in our container if possible, otherwise default (body)
                // Note: cheerpjCreateDisplay might append to body by default.
                // We pass specific dimensions.
                await window.cheerpjCreateDisplay(800, 600, containerRef.current || undefined);
                addLog('Display created explicitly.');
            } else {
                addLog('cheerpjCreateDisplay not found, skipping...');
            }

            addLog('Starting Application...');

            // Run the JAR
            // CheerpJ maps the web server root to /app/
            const jarPath = '/app/legacy/java/my3D.jar';
            addLog(`Loading JAR from: ${jarPath}`);
            await window.cheerpjRunJar(jarPath, '');
            setStatus('running');
            addLog('Application Started.');

            // Use MutationObserver to detect when CheerpJ adds the canvas to the body
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement) {
                            // console.log('Added node:', node.tagName, node.id, node.className);
                            if (node.tagName === 'CANVAS' || node.id.startsWith('cj')) {
                                if (containerRef.current && !containerRef.current.contains(node)) {
                                    containerRef.current.appendChild(node);
                                    node.style.width = '100%';
                                    node.style.height = '100%';
                                    node.style.position = 'absolute';
                                    node.style.top = '0';
                                    node.style.left = '0';
                                    node.style.zIndex = '10';
                                    addLog(`Display attached: ${node.tagName} ${node.id}`);
                                    observer.disconnect();
                                }
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true }); // Observe subtree too

            // Fallback: Check if it's already there (in case we missed the mutation)
            const existingCanvas = document.querySelector('canvas');
            if (existingCanvas && containerRef.current && !containerRef.current.contains(existingCanvas)) {
                containerRef.current.appendChild(existingCanvas);
                existingCanvas.style.width = '100%';
                existingCanvas.style.height = '100%';
                existingCanvas.style.position = 'absolute';
                existingCanvas.style.top = '0';
                existingCanvas.style.left = '0';
                addLog('Display attached (fallback).');
                observer.disconnect();
            }

            // Stop observing after 30 seconds
            setTimeout(() => {
                observer.disconnect();
                if (status === 'running') {
                    addLog('Stopped looking for display.');
                }
            }, 30000);

        } catch (err) {
            console.error(err);
            setStatus('error');
            addLog(`Error: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const handleManualFix = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            if (containerRef.current && !containerRef.current.contains(canvas)) {
                containerRef.current.appendChild(canvas);
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                addLog('Manual fix: Display attached.');
            } else {
                addLog('Canvas found but already in container.');
            }
        } else {
            addLog('Manual fix: No canvas found in document.');
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 font-sans pb-12">
            <Script
                src="https://cjrtnc.leaningtech.com/3.0/cj3loader.js"
                strategy="afterInteractive"
                onLoad={() => initCheerpJ()}
                onError={() => {
                    setStatus('error');
                    addLog('Failed to load CheerpJ script');
                }}
            />

            <div className="container mx-auto px-4">
                <Navbar />
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-4">
                        Java 3D Engine
                        <a href="https://github.com/yiting007/myJava3D/tree/master" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                            <FaCodeFork />
                        </a>
                    </h1>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <div className="mb-4 text-gray-700">
                            <p className="mb-2">
                                This is a legacy Java application running directly in your browser using WebAssembly (via CheerpJ).
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600 bg-gray-100 p-4 rounded">
                                <li><strong>Controls:</strong></li>
                                <li>Press <code>r</code>, <code>u</code>, <code>f</code> to rotate the Right, Up, and Front planes.</li>
                                <li>Use <strong>Arrow Keys</strong> to rotate the viewing angle.</li>
                            </ul>
                        </div>

                        <div
                            ref={containerRef}
                            id="cheerpjContainer"
                            className="relative w-full h-[600px] bg-gray-200 rounded border border-gray-300 overflow-hidden flex items-center justify-center"
                        >
                            {/* CheerpJ usually attaches to the body or creates its own overlay, 
                                but we can try to contain it or just let it overlay. 
                                Standard CheerpJ 3.0 runs in a canvas appended to the document body by default,
                                but we can style the specific canvas if needed. 
                                For now, we provide a placeholder area. 
                            */}
                            {status === 'loading' && (
                                <div className="text-white animate-pulse">Loading Java Environment...</div>
                            )}
                            {status === 'error' && (
                                <div className="text-red-500">Failed to start Java Engine.</div>
                            )}
                        </div>

                        <div className="mt-4 p-2 bg-gray-900 text-green-400 font-mono text-xs rounded h-32 overflow-y-auto">
                            {logs.map((log, i) => (
                                <div key={i}>&gt; {log}</div>
                            ))}
                        </div>

                        <div className="mt-2 text-center">
                            <button
                                onClick={handleManualFix}
                                className="text-xs text-blue-500 hover:underline"
                            >
                                Troubleshoot: Fix Display
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
