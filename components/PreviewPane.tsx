'use client';

import { useState, useMemo, useCallback } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { gridToText, getTextStats, generateFilename, type NewlineType } from '@/lib/export/toText';

export default function PreviewPane() {
  const { grid } = useEditorStore();
  const [newlineType, setNewlineType] = useState<NewlineType>('lf');
  const [asciiMode, setAsciiMode] = useState(false);
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // テキスト生成（メモ化）
  const outputText = useMemo(() => {
    return gridToText(grid, {
      newline: newlineType,
      asciiMode
    });
  }, [grid, newlineType, asciiMode]);

  // 統計情報
  const stats = useMemo(() => {
    return getTextStats(outputText);
  }, [outputText]);

  // プレビュー用テキスト（スペース幅調整＋空白可視化対応）
  const previewText = useMemo(() => {
    let text = outputText;
    
    if (!showWhitespace) {
      // スペースをem spaceに置換（幅調整用）
      text = text.replace(/ /g, '\u2003'); // em space
    } else {
      // 行末スペースを可視化（· で表示）
      text = text.split(/\r\n|\n|\r/).map(line => {
        return line.replace(/ +$/, (match) => '·'.repeat(match.length));
      }).join('\n');
      // 行末以外のスペースも幅調整
      text = text.replace(/ (?!·)/g, '\u2003');
    }
    
    return text;
  }, [outputText, showWhitespace]);

  // クリップボードコピー
  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(outputText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        // フォールバック：textarea を使用
        const textarea = document.createElement('textarea');
        textarea.value = outputText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('コピーに失敗しました');
    }
  }, [outputText]);

  // .txt ファイルダウンロード
  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([outputText], { 
        type: 'text/plain;charset=utf-8' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateFilename();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download:', error);
      alert('ダウンロードに失敗しました');
    }
  }, [outputText]);

  return (
    <div className="h-full p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Preview</h2>
      
      {/* 統計情報 */}
      <div className="text-xs text-gray-600 mb-3">
        {stats.lines}行 / {stats.charsWithoutNewlines}文字 / {stats.chars}文字（改行含む）
      </div>

      {/* オプション */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={asciiMode}
              onChange={(e) => setAsciiMode(e.target.checked)}
              className="mr-1"
            />
            ASCII等幅で出力
          </label>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={showWhitespace}
              onChange={(e) => setShowWhitespace(e.target.checked)}
              className="mr-1"
            />
            行末スペース可視化
          </label>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm">
            改行:
            <select
              value={newlineType}
              onChange={(e) => setNewlineType(e.target.value as NewlineType)}
              className="ml-1 text-xs border border-gray-300 rounded px-1"
            >
              <option value="lf">LF</option>
              <option value="crlf">CRLF</option>
            </select>
          </label>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleCopy}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            copySuccess
              ? 'bg-green-100 border-green-300 text-green-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {copySuccess ? 'コピー完了！' : 'コピー'}
        </button>
        
        <button
          onClick={handleDownload}
          className="px-3 py-1 text-sm rounded border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          .txt 保存
        </button>
      </div>

      {/* プレビューエリア */}
      <div className="flex-1 overflow-auto border border-gray-300 rounded">
        <pre 
          className="whitespace-pre font-mono text-xs p-2 h-full overflow-auto"
          style={{ 
            lineHeight: '1.2',
            tabSize: 1,
            fontFamily: 'Consolas, "Courier New", monospace',
            fontSize: '11px'
          }}
        >
          {previewText}
        </pre>
      </div>
    </div>
  );
}