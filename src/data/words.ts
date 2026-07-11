import type { DeckId, Register, RouteId, Word } from '../lib/types'
import { B2_LIFE_02 } from './words_b2_life_02'
import { B2_LIFE_03 } from './words_b2_life_03'
import { C1_LIFE_02 } from './words_c1_life_02'
import { C2_LIFE_02 } from './words_c2_life_02'
import { TOEFL_02 } from './words_toefl_02'
import { GRE_02 } from './words_gre_02'

type Seed = [word: string, phonetic: string, partOfSpeech: string, definitionZh: string, definitionEn: string, example: string, exampleZh: string, topic: string, register: Register, learningFocus: string, synonyms?: string[]]

function routeFor(deck: DeckId): RouteId {
  return deck === 'CEFR_B2' || deck === 'CEFR_C1' || deck === 'CEFR_C2' ? 'life' : 'academic'
}

function deckWords(deck: DeckId, prefix: string, seeds: Seed[]): Word[] {
  return seeds.map((seed, index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    deck,
    route: routeFor(deck),
    word: seed[0], phonetic: seed[1], partOfSpeech: seed[2], definitionZh: seed[3], definitionEn: seed[4],
    example: seed[5], exampleZh: seed[6], topic: seed[7], register: seed[8], learningFocus: seed[9], synonyms: seed[10],
  }))
}

const B2 = deckWords('CEFR_B2', 'b2', [
  ['compromise','/ˈkɒmprəmaɪz/','noun','妥協；折衷方案','an agreement in which each side accepts less than it wanted','We reached a compromise that gave everyone part of what they needed.','我們達成折衷方案，讓每個人都得到部分所需。','relationships','neutral','生活溝通：協商分歧並提出折衷方案',['agreement','middle ground']],
  ['persuade','/pəˈsweɪd/','verb','說服；勸服','to make someone agree to do or believe something','She persuaded her landlord to repair the heating.','她說服房東修理暖氣。','communication','neutral','生活溝通：清楚提出理由並說服他人',['convince','influence']],
  ['hesitate','/ˈhezɪteɪt/','verb','猶豫；遲疑','to pause before doing something because you are uncertain','Do not hesitate to ask if the instructions are unclear.','如果指示不清楚，請不要猶豫提出問題。','decisions','neutral','生活溝通：敘述不確定與做決定的過程',['pause','waver']],
  ['reassure','/ˌriːəˈʃʊə/','verb','使安心；打消疑慮','to make someone feel less worried','The doctor reassured me that the symptoms were temporary.','醫生向我保證症狀只是暫時的，讓我安心。','relationships','neutral','生活溝通：回應擔憂並安撫他人',['comfort','assure']],
  ['inconvenience','/ˌɪnkənˈviːniəns/','noun','不便；麻煩','trouble or difficulty caused to someone','We apologize for the inconvenience caused by the delay.','對於延誤造成的不便，我們深感抱歉。','services','formal','生活溝通：禮貌處理服務問題與抱怨',['trouble','disruption']],
  ['boundary','/ˈbaʊndri/','noun','界線；分界','a limit that defines acceptable behavior or an area','It is important to set clear boundaries at work.','在工作中設定清楚界線很重要。','relationships','neutral','生活溝通：討論人際與工作界線',['limit','border']],
  ['outcome','/ˈaʊtkʌm/','noun','結果；成果','the final result of an action or process','The outcome depends on how well the team communicates.','結果取決於團隊溝通得多好。','work','neutral','工作表達：說明行動結果與利弊分析',['result','consequence']],
  ['maintain','/meɪnˈteɪn/','verb','維持；保養；堅稱','to keep something at the same level or in good condition','It can be difficult to maintain a healthy work-life balance.','維持健康的工作與生活平衡可能很困難。','work','neutral','生活與工作表達：討論持續維持某種狀態',['preserve','sustain']],
  ['tendency','/ˈtendənsi/','noun','傾向；趨勢','a usual way of behaving or a likely direction of change','I have a tendency to overthink small decisions.','我常有把小決定想得太多的傾向。','behavior','neutral','生活溝通：描述習慣、行為模式與趨勢',['inclination','trend']],
  ['efficient','/ɪˈfɪʃənt/','adjective','有效率的','working well without wasting time or resources','The new booking system is faster and more efficient.','新的預約系統更快速也更有效率。','work','neutral','工作表達：比較方法並分析效率與利弊',['effective','productive']],
  ['dismiss','/dɪsˈmɪs/','verb','不予理會；解僱；讓人離開','to decide that an idea is not worth considering','Do not dismiss her concerns before hearing the full story.','在聽完事情全貌前，不要對她的擔憂不予理會。','communication','neutral','溝通表達：回應觀點並避免草率否定',['reject','disregard']],
  ['worthwhile','/ˌwɜːθˈwaɪl/','adjective','值得花時間或精力的','useful or enjoyable enough to justify the effort','The course was demanding but ultimately worthwhile.','這門課要求很高，但最終很值得。','opinions','neutral','觀點表達：評估經驗是否值得並解釋理由',['valuable','rewarding']],
] as Seed[])

const C1 = deckWords('CEFR_C1', 'c1', [
  ['articulate','/ɑːˈtɪkjələt/','adjective','善於清楚表達的','able to express ideas clearly and effectively','She is articulate even when discussing emotionally difficult topics.','即使討論情緒上困難的話題，她仍能清楚表達。','communication','formal','工作與社交表達：有條理地闡述複雜觀點',['eloquent','expressive']],
  ['compelling','/kəmˈpelɪŋ/','adjective','令人信服的；引人入勝的','very convincing or able to hold attention','He made a compelling case for changing the schedule.','他提出令人信服的理由，主張更改時程。','opinions','neutral','觀點表達：建立有說服力且完整的論證',['convincing','persuasive']],
  ['anticipate','/ænˈtɪsɪpeɪt/','verb','預期；預先處理','to expect something and prepare for it','We anticipated resistance and prepared several alternatives.','我們預期會有阻力，因此準備了幾個替代方案。','work','formal','工作表達：預測問題並說明因應方式',['expect','foresee']],
  ['acknowledge','/əkˈnɒlɪdʒ/','verb','承認；確認；致意','to accept that something is true or exists','The manager acknowledged that the transition had been poorly handled.','經理承認這次轉換處理得不好。','communication','formal','社交與工作溝通：承認問題並得體回應',['admit','recognize']],
  ['subtle','/ˈsʌtəl/','adjective','細微的；不易察覺的','not obvious and therefore difficult to notice','There was a subtle change in her tone when the topic came up.','話題出現時，她的語氣有了細微變化。','communication','neutral','理解表達：辨識含蓄訊息與細微語氣',['nuanced','delicate']],
  ['feasible','/ˈfiːzəbəl/','adjective','可行的','possible and practical to do successfully','Remote work is feasible, provided that the security issues are resolved.','只要解決安全問題，遠端工作是可行的。','work','formal','工作表達：評估提案是否實際可行',['viable','workable']],
  ['convey','/kənˈveɪ/','verb','傳達；表達','to communicate a feeling, idea, or meaning','Her message conveyed urgency without sounding aggressive.','她的訊息傳達出急迫感，卻不顯得咄咄逼人。','communication','formal','語氣表達：精準傳達態度、感受與意圖',['communicate','express']],
  ['misconception','/ˌmɪskənˈsepʃən/','noun','錯誤觀念；誤解','an incorrect belief or understanding','A common misconception is that confidence means never feeling nervous.','常見的誤解是，自信就代表從不緊張。','ideas','neutral','觀點表達：辨認並修正常見誤解',['misunderstanding','fallacy']],
  ['accountability','/əˌkaʊntəˈbɪləti/','noun','問責；承擔責任','the duty to accept responsibility for decisions','Clear roles improve accountability within a team.','清楚的角色分工能提升團隊中的責任承擔。','work','formal','工作表達：討論責任歸屬與專業倫理',['responsibility','answerability']],
  ['resilience','/rɪˈzɪliəns/','noun','復原力；韌性','the ability to recover after difficulty','Moving abroad tested her resilience and independence.','移居海外考驗了她的韌性與獨立性。','life','neutral','生活敘述：描述從困境恢復與適應改變',['toughness','adaptability']],
  ['consensus','/kənˈsensəs/','noun','共識','general agreement among a group','After a lengthy discussion, the team reached a consensus.','經過長時間討論，團隊達成了共識。','work','formal','協商表達：統整不同意見並形成共識',['agreement','accord']],
  ['implication','/ˌɪmplɪˈkeɪʃən/','noun','可能的影響；含意','a possible effect or meaning that is not stated directly','We need to consider the long-term implications of this decision.','我們需要考慮這項決定的長期影響。','reasoning','formal','理解與觀點表達：推論未明說的含意與後果',['consequence','inference']],
] as Seed[])

const C2 = deckWords('CEFR_C2', 'c2', [
  ['ambivalent','/æmˈbɪvələnt/','adjective','矛盾的；同時抱持兩種感受的','having mixed or opposing feelings about something','I remain ambivalent about the promotion: it is flattering but disruptive.','我對升遷仍感矛盾：它令人欣喜，卻也打亂生活。','feelings','formal','精準表達語氣：區分矛盾感受而非單純猶豫',['conflicted','uncertain']],
  ['condescending','/ˌkɒndɪˈsendɪŋ/','adjective','居高臨下的；屈尊俯就的','showing that you believe you are more intelligent or important','His explanation was accurate, but the condescending tone alienated everyone.','他的解釋正確，但居高臨下的語氣疏遠了所有人。','communication','formal','精準表達語氣：辨識表面禮貌下的優越態度',['patronizing','superior']],
  ['facetious','/fəˈsiːʃəs/','adjective','在嚴肅場合故作幽默的','treating a serious matter with deliberately inappropriate humor','Her facetious remark was misread as a genuine suggestion.','她那句故作幽默的話被誤認為真心建議。','humor','formal','精準表達語氣：理解反諷玩笑與認真陳述的差別',['flippant','waggish']],
  ['presumptuous','/prɪˈzʌmptʃuəs/','adjective','自以為是的；冒昧的','too confident in acting without permission or authority','It would be presumptuous of me to speak on their behalf.','由我代表他們發言未免太冒昧。','etiquette','formal','社交表達：精準判斷越界、冒昧與禮貌程度',['forward','overconfident']],
  ['nonchalant','/ˈnɒnʃələnt/','adjective','若無其事的；漠不關心似的','appearing calmly unconcerned','She gave a nonchalant shrug, although the result clearly mattered to her.','她若無其事地聳肩，儘管結果顯然對她很重要。','behavior','literary','精準敘述：描寫外在冷靜與內在在意的反差',['casual','unconcerned']],
  ['fastidious','/fæˈstɪdiəs/','adjective','一絲不苟且要求很高的','very attentive to detail and difficult to satisfy','He is fastidious about wording and revises every sentence repeatedly.','他對措辭極為講究，每句話都反覆修改。','character','formal','精準敘述：區分細心、挑剔與高標準',['meticulous','exacting']],
  ['poignant','/ˈpɔɪnjənt/','adjective','令人深受感動或悲傷的','causing a strong feeling of sadness or tenderness','The empty playground was a poignant reminder of how much had changed.','空蕩的遊樂場令人感傷地想起一切已改變許多。','feelings','literary','精準表達語氣：描述帶有悲傷與溫柔的感動',['moving','touching']],
  ['unequivocal','/ˌʌnɪˈkwɪvəkəl/','adjective','明確無疑的；毫不含糊的','expressed in a completely clear and certain way','Her refusal was polite but unequivocal.','她的拒絕很有禮貌，但毫不含糊。','communication','formal','精準表達語氣：強調立場明確且無歧義',['unambiguous','definite']],
  ['incongruous','/ɪnˈkɒŋɡruəs/','adjective','不協調的；不合情境的','strange because it does not fit with its surroundings','The cheerful music felt incongruous with the solemn ceremony.','歡快的音樂與莊嚴儀式顯得格格不入。','description','formal','精準敘述：指出元素與情境不協調的反差',['incompatible','out of place']],
  ['wry','/raɪ/','adjective','挖苦而略帶無奈的','using dry humor, often about an unpleasant situation','With a wry smile, he admitted that his shortcut had taken twice as long.','他帶著無奈的苦笑承認，抄近路反而花了兩倍時間。','humor','literary','精準表達語氣：理解帶有諷刺與無奈的幽默',['ironic','dry']],
  ['circumspect','/ˈsɜːkəmspekt/','adjective','謹慎周到的','careful to consider risks before acting or speaking','She was circumspect when discussing the confidential merger.','談到機密併購案時，她措辭十分謹慎。','work','formal','工作表達：精準描述審慎評估風險的態度',['cautious','prudent']],
  ['disingenuous','/ˌdɪsɪnˈdʒenjuəs/','adjective','不坦率的；假裝不知道的','not candid or sincere, especially by pretending ignorance','It is disingenuous to claim that nobody anticipated the problem.','聲稱沒有人預見這個問題並不坦率。','reasoning','formal','精準表達語氣：辨識刻意裝無知或避重就輕',['insincere','evasive']],
] as Seed[])

const GRE = deckWords('GRE', 'gre', [
  ['recondite','/ˈrekəndaɪt/','adjective','深奧難懂的；鮮為人知的','little known and difficult to understand','The essay examines a recondite dispute in medieval philosophy.','這篇文章探討中世紀哲學中一場深奧的爭論。','academic','formal','GRE 閱讀與填空：辨識「深奧難懂」語意',['abstruse','arcane']],
  ['perspicacious','/ˌpɜːspɪˈkeɪʃəs/','adjective','有洞察力的；敏銳的','having a ready insight into complex matters','Her perspicacious analysis exposed the proposal’s hidden flaw.','她敏銳的分析揭露了提案中隱藏的缺陷。','reasoning','formal','GRE 閱讀與填空：區分敏銳洞察與一般聰明',['astute','insightful']],
  ['intransigent','/ɪnˈtrænsɪdʒənt/','adjective','不妥協的；頑固的','unwilling to change one’s views or agree','The negotiators remained intransigent despite mounting pressure.','儘管壓力增加，談判者仍不肯妥協。','conflict','formal','GRE 閱讀與填空：掌握拒不妥協的負面語氣',['unyielding','inflexible']],
  ['equivocate','/ɪˈkwɪvəkeɪt/','verb','含糊其辭；閃爍其詞','to use ambiguous language to avoid commitment','When asked for evidence, the witness began to equivocate.','被要求提出證據時，證人開始含糊其辭。','language','formal','GRE 填空：辨識刻意使用模糊語言',['prevaricate','hedge']],
  ['obfuscate','/ˈɒbfəskeɪt/','verb','使模糊；使難懂','to make something less clear and harder to understand','The dense terminology obfuscates a fairly simple argument.','繁複術語把其實簡單的論點弄得難懂。','language','formal','GRE 閱讀：辨識使概念不清楚的動作',['obscure','confuse']],
  ['deleterious','/ˌdelɪˈtɪəriəs/','adjective','有害的；造成損害的','causing harm or damage','Chronic sleep loss has deleterious effects on cognition.','長期睡眠不足會對認知造成有害影響。','science','formal','GRE 閱讀與填空：掌握正式語域的有害效果',['harmful','detrimental']],
  ['ephemeral','/ɪˈfemərəl/','adjective','短暫的；轉瞬即逝的','lasting for a very short time','The movement enjoyed only ephemeral popularity.','這場運動只享有短暫的聲勢。','change','literary','GRE 閱讀與填空：對比短暫與持久',['fleeting','transient']],
  ['sagacious','/səˈɡeɪʃəs/','adjective','睿智的；有遠見的','showing sound judgment and practical wisdom','The chairperson’s sagacious intervention prevented a split.','主席睿智的介入避免了分裂。','judgment','formal','GRE 填空：辨識智慧且判斷良好的正面語氣',['wise','discerning']],
  ['perfunctory','/pəˈfʌŋktəri/','adjective','敷衍的；草率的','done with little interest, care, or effort','The agency conducted a merely perfunctory review.','該機構只進行了一次敷衍的審查。','work','formal','GRE 閱讀與填空：辨識缺乏投入的負面語氣',['cursory','superficial']],
  ['quixotic','/kwɪkˈsɒtɪk/','adjective','理想化但不切實際的','extremely idealistic but impractical','The plan to eliminate all waste overnight was quixotic.','一夜之間消除所有浪費的計畫過度理想化。','ideas','literary','GRE 閱讀：區分高尚理想與不切實際',['idealistic','impractical']],
  ['trenchant','/ˈtrentʃənt/','adjective','犀利而有效的','expressed forcefully, clearly, and effectively','The critic offered a trenchant analysis of the policy.','評論家對政策提出了犀利的分析。','language','formal','GRE 閱讀與填空：掌握言論犀利有力的語意',['incisive','forceful']],
  ['magnanimous','/mæɡˈnænɪməs/','adjective','寬宏大量的；高尚大度的','generous and forgiving toward a rival','She was magnanimous in victory and praised her opponent.','她勝而不驕，並稱讚對手。','character','formal','GRE 填空：辨識勝利時寬厚大度的正面品格',['generous','noble']],
] as Seed[])

const TOEFL = deckWords('TOEFL', 'toefl', [
  ['ubiquitous','/juːˈbɪkwɪtəs/','adjective','無所不在的','present or found everywhere','Microplastics have become ubiquitous in marine environments.','微塑膠在海洋環境中已無所不在。','environment','formal','TOEFL 學術閱讀：描述廣泛分布的現象',['pervasive','omnipresent']],
  ['mitigate','/ˈmɪtɪɡeɪt/','verb','緩和；減輕','to make something harmful less severe','Wetlands can mitigate the effects of coastal flooding.','濕地可以減輕沿海洪水的影響。','environment','formal','TOEFL 學術閱讀：理解減輕負面影響的措施',['alleviate','reduce']],
  ['proliferate','/prəˈlɪfəreɪt/','verb','迅速增加；激增','to increase rapidly in number','Small mammals proliferated after their predators disappeared.','掠食者消失後，小型哺乳動物迅速增加。','biology','formal','TOEFL 學術閱讀：描述數量快速增加',['multiply','spread']],
  ['paradigm','/ˈpærədaɪm/','noun','典範；思維模式','a model or framework for understanding something','The discovery produced a new paradigm in planetary science.','這項發現為行星科學帶來新的典範。','science','formal','TOEFL 學術閱讀：辨識理論框架與典範轉移',['framework','model']],
  ['empirical','/ɪmˈpɪrɪkəl/','adjective','以觀察或實驗為基礎的','based on observation or experiment rather than theory','The hypothesis lacks sufficient empirical support.','這項假說缺乏足夠的實證支持。','research','formal','TOEFL 學術閱讀：區分實證證據與理論主張',['observational','experimental']],
  ['sustainable','/səˈsteɪnəbəl/','adjective','可持續的；永續的','able to continue without exhausting resources','Farmers adopted more sustainable irrigation practices.','農民採用了更永續的灌溉方式。','environment','formal','TOEFL 學術閱讀：討論資源與長期可持續性',['viable','renewable']],
  ['facilitate','/fəˈsɪlɪteɪt/','verb','促進；使更容易','to make a process easier or more likely','Trade routes facilitated the exchange of ideas and technology.','貿易路線促進了思想與技術交流。','history','formal','TOEFL 學術閱讀：理解促成某過程的因素',['enable','promote']],
  ['indigenous','/ɪnˈdɪdʒənəs/','adjective','原生的；本土的','originating naturally in a particular place','The island has several indigenous plant species.','這座島有數種原生植物。','biology','formal','TOEFL 學術閱讀：辨識本土物種與文化',['native','aboriginal']],
  ['infrastructure','/ˈɪnfrəstrʌktʃə/','noun','基礎設施','basic systems and structures needed by a society','Railway infrastructure accelerated regional development.','鐵路基礎設施加速了區域發展。','society','formal','TOEFL 學術閱讀：理解社會與經濟基礎系統',['framework','facilities']],
  ['hypothesis','/haɪˈpɒθəsɪs/','noun','假說；假設','a proposed explanation that can be tested','The experiment was designed to test the original hypothesis.','這項實驗是為了檢驗原始假說。','research','formal','TOEFL 學術閱讀：掌握科學研究與假說驗證',['theory','proposition']],
  ['cumulative','/ˈkjuːmjələtɪv/','adjective','累積的','increasing gradually as more is added','The cumulative effect of small changes transformed the ecosystem.','許多小變化的累積效應改變了生態系。','change','formal','TOEFL 學術閱讀：理解逐步累積的影響',['accumulated','aggregate']],
  ['diminish','/dɪˈmɪnɪʃ/','verb','減少；削弱','to become or make something smaller or less important','Soil fertility diminished after years of intensive farming.','多年密集耕作後，土壤肥力下降。','environment','formal','TOEFL 學術閱讀：描述程度或數量逐漸降低',['decrease','decline']],
] as Seed[])

export const WORDS: Word[] = [...B2, ...B2_LIFE_02, ...B2_LIFE_03, ...C1, ...C1_LIFE_02, ...C2, ...C2_LIFE_02, ...TOEFL, ...TOEFL_02, ...GRE, ...GRE_02]
