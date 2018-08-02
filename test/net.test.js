import assert from 'assert';
import $ from './env';
import { HttpDataSource } from 'tigerface-network';

let ds = new HttpDataSource('http://localhost:8080');

describe('测试 Http 数据源 HttpDataSource', () => {
    it('初始心跳请求，返回新的 uuid', () => {
        ds.sendHeartBeat();
    });

    it('测试 getByID', () => {
        ds.getByID('person', 1);
    });

    it('测试 find', () => {
        ds.find('person');
    });

    it('测试 add', () => {
        ds.add('person', {name:'asdfasdlf'});
    });

    it('测试 modify', () => {
        ds.modify('person', {id:1003, name:'rotiyuortyi'});
    });

    it('测试 delete', () => {
        ds.remove('person', {id:1003, name:'rotiyuortyi'});
    });
});