/**
 * Created by Administrator on 2017/4/1.
 */
// [ClientName]
// name=周界安全管理平台
//
//     [ClientName]
// name=Electric Fence Software/ EFence
//
//
//
//     [AlarmType]
// id1=布防正常
// id2=撤防正常
// id3=防区掉线
// id4=探测器掉线
// id5=断电报警
// id6=防区故障
// id7=防拆报警
// id8=短路报警
// id9=断路报警
// id10=触网报警
// id11=防剪报警
// id12=低电报警
// id13=报警
// id14=断电报警
// id15=拉紧报警
// id16=松弛报警
// id17=防区关机
// id18=防区禁用
// id19=撤防时防区掉线
// id20=撤防时探测器掉线
// id21=撤防时断电报警
// id22=撤防时防区故障
// id23=撤防时防拆报警
// id24=撤防时低电报警
// id25=撤防时断电报警
// id26=撤防命令
// id27=布防命令
// id28=高压布防命令
// id29=低压布防命令
// id30=张力高压布防命令
// id31=张力布防命令
// id32=复位命令
// id33=入侵报警
// id34=断纤报警
//
//     [AlarmType]
// id1=Armed properly
// id2=Disarm normal
// id3=Zone dropped
// id4==Detector dropped
// id5=Power off alarm
// id6=Zone fault
// id7=Tamper alarm
// id8=Short circuit alarm
// id9=Open circuit alarm
// id10=Touch net alarm
// id11=Anti-shear alarm
// id12=Low power alarm
// id13=Alarm
// id14=Power off alarm
// id15=Tension alarm
// id16=Relaxing alarm
// id17=Zone shut down
// id18=Zone disabled
// id19=Disarm defense zone dropped
// id20=Disarm when the detector dropped
// id21=Disarm alarm when off
// id22=Disarm defense zone failure
// id23=Disarm alarm when disarmed
// id24=Disarm low alarm
// id25=Disarm alarm when off
// id26=Disarm command
// id27=Arming command
// id28=High-pressure deployment command
// id29=Low-voltage deployment command
// id30=Tension high-pressure deployment command
// id31=Low-voltage deployment command
// id32=Reset command
// id33=Intrusion alarm
// id34=Broken alarm
//
//
//     [DevType]
// id1=高压电网
// id2=脉冲围栏
// id3=脉冲围栏
// id4=张力围栏
// id5=市电模块
// id6=地址模块
// id7=振动光纤
// id8=微波雷达
//
//     [ActionType]
// id1=撤防
// id2=布防
// id3=高压布防
// id4=低压布防
// id5=张力高压布防
// id6=张力布防
//
//     [DevType]
// id1=HVPrisonFence
// id2=PulseFence
// id3=PulseFence
// id4=TensionFence
// id5=MainsModule
// id6=AddrModule
//
//     [ActionType]
// id1=Disarm
// id2=Arming
// id3=HighVoltArming
// id4=LowVoltArming
// id5=TensionHighVoltArming
// id6=TensionArming
// id7=VibratingFiber
// id8=MicrowaveRadar

export const stateText = [
    '布防',
    '撤防',
    '报警',
    '掉线'
];

export const stateSelectText = [
    '布防',
    '撤防',
    '报警',
    '掉线',
    '复位',
    '全部'
];

export const typeText = [
    '高压电网',
    '脉冲围栏',
    '脉冲围栏',
    '张力围栏',
    '市电模块',
    '地址模块',
];


export const alarmText = [
    '布防正常',
    '撤防正常',
    '防区掉线',
    '探测器掉线',
    '断电报警',
    '防区故障',
    '防拆报警',
    '短路报警',
    '断路报警',
    '触网报警',
    '防剪报警',
    '低电报警',
    '报警',
    '断电报警',
    '拉紧报警',
    '松弛报警',
    '防区关机',
    '防区禁用',
    '撤防时防区掉线',
    '撤防时探测器掉线',
    '撤防时断电报警',
    '撤防时防区故障',
    '撤防时防拆报警',
    '撤防时低电报警',
    '撤防时断电报警',
    '撤防命令',
    '布防命令',
    '高压布防命令',
    '低压布防命令',
    '张力高压布防命令',
    '张力布防命令',
    '复位命令'
];


export const confirm = ['确定', '取消'];
export const noData = "没有数据";
export const searchHint = "搜索";
export const all = "全部";
export const noAlarm = "没有报警信息";
export const alarmType = "警报类型";
export const selectHint = "选择";
export const beginTime = "开始时间";
export const endTime = "结束时间";
export const operator = "操作人";
export const fillHint = "填写";
export const place = "地点";
export const collopse = "收起";
export const findAlarm = "查询警报";
export const alarmInfo = "报警信息";
export const alarmDetail = "报警详细";
export const alarmSearch = "搜索报警";
export const refresh = "刷新中...";
export const load = "加载更多";
export const comeFrom = "来自";