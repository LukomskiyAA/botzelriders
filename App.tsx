
import React, { useState, useRef } from 'react';
import { BotConfig } from './types';
import BotPreview from './components/BotPreview';
import CodeGenerator from './components/CodeGenerator';
import { refineWelcomeMessage } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<BotConfig>({
    token: '8394525518:AAF5RD0yvNLZQjiTS3wN61cC3K2HbNwJtxg',
    welcomeMessage: 'Zel RIders приветствует тебя!\n\nДля дальнейшего вступления в чат, необходимо перейти по кнопке ниже и заполнить анкету!',
    imageUrl: 'https://i.ibb.co/6RL2S1rv/nakleika.png',
    buttonText: 'Заполнить анкету',
    buttonUrl: 'https://zel-riders-miniapp.vercel.app/'
  });

  const [isRefining, setIsRefining] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRefine = async () => {
    if (!config.welcomeMessage) return;
    setIsRefining(true);
    const refined = await refineWelcomeMessage(config.welcomeMessage);
    setConfig(prev => ({ ...prev, welcomeMessage: refined }));
    setIsRefining(false);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              TeleGen
            </h1>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-gray-400 font-medium">
            <a href="#" className="hover:text-white transition-colors">Документация</a>
            <a href="#" className="hover:text-white transition-colors">Помощь</a>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            Экспорт бота
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <span className="p-1 bg-blue-600/20 text-blue-400 rounded text-xs">01</span> 
              Настройка Zel Riders
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Токен бота (от @BotFather)</label>
                <input 
                  type="text" 
                  name="token"
                  value={config.token}
                  onChange={handleInputChange}
                  placeholder="Вставьте токен..."
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-gray-600 shadow-inner"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Текст сообщения</label>
                  <button 
                    onClick={handleRefine}
                    disabled={isRefining || !config.welcomeMessage}
                    className="text-[10px] bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-2 py-1 rounded-md flex items-center gap-1 disabled:opacity-50 transition-colors font-medium border border-blue-600/20"
                  >
                    {isRefining ? '✨ Улучшаем...' : '✨ AI Исправить'}
                  </button>
                </div>
                <textarea 
                  name="welcomeMessage"
                  value={config.welcomeMessage}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white resize-none placeholder:text-gray-600 shadow-inner"
                  placeholder="О чем бот расскажет пользователю?"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Изображение</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    name="imageUrl"
                    value={config.imageUrl.startsWith('data:') ? 'Локальный файл загружен' : config.imageUrl}
                    onChange={handleInputChange}
                    placeholder="URL картинки или загрузите файл"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2.5 text-sm pr-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-gray-600 shadow-inner"
                  />
                  <button 
                    onClick={triggerFileUpload}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                    title="Загрузить фото с компьютера"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Текст кнопки</label>
                  <input 
                    type="text" 
                    name="buttonText"
                    value={config.buttonText}
                    onChange={handleInputChange}
                    placeholder="Заполнить анкету"
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Ссылка</label>
                  <input 
                    type="text" 
                    name="buttonUrl"
                    value={config.buttonUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
             </div>
             <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <span className="p-1 bg-green-600/20 text-green-400 rounded text-xs">🚀</span> 
              Быстрый запуск
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-bold flex items-center justify-center">1</div>
                <div>
                   <p className="text-sm font-semibold text-white">Установите Node.js</p>
                   <p className="text-xs text-gray-400 mt-0.5">Скачайте с официального сайта и установите на ПК.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-bold flex items-center justify-center">2</div>
                <div>
                   <p className="text-sm font-semibold text-white">Скопируйте код</p>
                   <p className="text-xs text-gray-400 mt-0.5">Вставьте его в файл <code>bot.js</code> в любой папке.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-bold flex items-center justify-center">3</div>
                <div>
                   <p className="text-sm font-semibold text-white">Запустите терминал</p>
                   <p className="text-xs text-gray-400 mt-0.5">Введите <code>npm install grammy</code>, затем <code>node bot.js</code>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Preview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col h-full">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="p-1 bg-purple-600/20 text-purple-400 rounded text-xs">02</span> 
              Как это выглядит
            </h2>
            <div className="flex-1 flex items-center justify-center bg-[#0f172a]/50 rounded-2xl p-4 border border-gray-800/50">
              <BotPreview config={config} />
            </div>
          </div>
        </div>

        {/* Right Column: Code Output */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-xl">
             <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="p-1 bg-orange-600/20 text-orange-400 rounded text-xs">03</span> 
              Код вашего бота
            </h2>
            <CodeGenerator config={config} />
            
            <div className="mt-8 space-y-4">
               <h3 className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Где держать бота 24/7</h3>
               <div className="grid grid-cols-1 gap-3">
                 <a href="https://railway.app" target="_blank" rel="noreferrer" className="p-4 bg-[#0f172a] border border-gray-700 rounded-xl flex items-center justify-between hover:bg-blue-500/5 hover:border-blue-500/50 transition-all group shadow-sm">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">R</div>
                     <div>
                       <p className="text-sm font-bold text-white">Railway.app</p>
                       <p className="text-[10px] text-gray-500">Идеально для маленьких ботов</p>
                     </div>
                   </div>
                   <span className="text-xs text-blue-400 group-hover:translate-x-1 transition-transform">Узнать &rarr;</span>
                 </a>

                 <a href="https://render.com" target="_blank" rel="noreferrer" className="p-4 bg-[#0f172a] border border-gray-700 rounded-xl flex items-center justify-between hover:bg-purple-500/5 hover:border-purple-500/50 transition-all group shadow-sm">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 border border-purple-500/20">Re</div>
                     <div>
                       <p className="text-sm font-bold text-white">Render.com</p>
                       <p className="text-[10px] text-gray-500">Бесплатный хостинг</p>
                     </div>
                   </div>
                   <span className="text-xs text-purple-400 group-hover:translate-x-1 transition-transform">Узнать &rarr;</span>
                 </a>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 mt-16 text-center text-gray-600 text-[10px] pb-10 uppercase tracking-[0.2em] font-medium">
        <p>TeleGen x Zel Riders &copy; 2025</p>
      </footer>
    </div>
  );
};

export default App;
