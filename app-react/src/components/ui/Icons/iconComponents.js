/**  ai   **/
import { AiOutlineUserAdd } from 'react-icons/ai'; //------------------

/**  bi   **/
import { BiMailSend } from 'react-icons/bi'; //------------------

/**   bs   **/
import { BsCaretDownFill } from 'react-icons/bs';
import { BsCaretLeft } from 'react-icons/bs';
import { BsCaretLeftFill } from 'react-icons/bs';
import { BsCaretUpFill } from 'react-icons/bs';
import { BsCaretRightFill } from 'react-icons/bs';
import { BsCaretRight } from 'react-icons/bs';
import { BsCalendarWeekFill } from 'react-icons/bs';
import { BsCalendarWeek } from 'react-icons/bs';
import { BsPerson } from 'react-icons/bs';

/**   cg   **/
// import { CgUserList } from 'react-icons/cg'

/**   fa   **/
import { FaHome } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa';
import { FaPencilAlt } from 'react-icons/fa';
import { FaRegSave } from 'react-icons/fa';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';
import { FaUpload } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaMoneyCheckAlt } from 'react-icons/fa';
// import { FaMoneyBill } from 'react-icons/fa';
import { FaPencilRuler } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { FaCheckSquare } from 'react-icons/fa';

/**   fi   **/
import { FiMail } from 'react-icons/fi';

/**   gr   **/
// import { GrSchedule } from 'react-icons/gr'
import { GrDocumentCsv } from 'react-icons/gr'
// import { GrUserAdd } from 'react-icons/gr'

/**   md   **/
import { MdListAlt } from 'react-icons/md' //or MdFormatListBulleted
import { MdClose } from 'react-icons/md'
import { MdNote } from 'react-icons/md'
import { MdOutlineCancel } from 'react-icons/md'
import { MdOutlineLogout } from 'react-icons/md'

/**   io   **/
import { IoMdPersonAdd } from 'react-icons/io'
// import { IoIosDocument } from 'react-icons/io'
// import { IoDocuments } from 'react-icons/io'

/**   im   **/
import { ImProfile } from 'react-icons/im'


const iconComponents = {
  /******   Sidebar   ******/
  Home: FaHome,
  Schedule: BsCalendarWeekFill,
  // Calendar: BsCalendarWeekFill,
  Calendar: BsCalendarWeek,
  Profile: ImProfile,
  MoneyCheck: FaMoneyCheckAlt,
  // MoneyBill: FaMoneyBill,
  Requests: FaPencilRuler,
  // Memos: MdListAlt,
  Memos: MdNote,
  List: MdListAlt,
  Permissions: IoMdPersonAdd,
  // Permissions: AiOutlineUserAdd,
  // Permissions: GrUserAdd,
  Logout: MdOutlineLogout,
  Person: BsPerson,

  /******   All Icon   ******/
  Bell: FaBell,
  Bars: FaBars,
  Cancel: MdOutlineCancel,
  Close: MdClose,
  ChevronLeft: FaChevronLeft,
  ChevronRight: FaChevronRight,
  CaretLeft: BsCaretLeftFill,
  CaretUp: BsCaretUpFill,
  CaretRight: BsCaretRightFill,
  CaretDown: BsCaretDownFill,
  CaretLeftOutline: BsCaretLeft,
  CaretRightOutline: BsCaretRight,
  CheckMark: FaCheck,
  CheckMarkSquared: FaCheckSquare,
  Csv: GrDocumentCsv,
  Download: FaDownload,
  Pen: FaPencilAlt,
  PenRuler: FaPencilRuler,
  Plus: FaPlus,
  Save: FaRegSave,
  SendMail: BiMailSend,
  Trash: FaRegTrashAlt,
  Mail: FiMail,
  Upload: FaUpload,
  UserAdd: AiOutlineUserAdd,
}
export default iconComponents