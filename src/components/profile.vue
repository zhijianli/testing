<style scoped>
.profile {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  color: #a5a5a5;
  text-align: center;
  font-size: 0.24rem;
  background-color: #f5f5f5;

  & .warning {
    margin: 0.3rem 0 0.2rem;
    color: #ff5b05;
    font-size: 0.28rem;
  }

  & .modal {
    color: #333;
  }
}
.profile-list {
  padding-left: 0.3rem;
  margin-top: 0.3rem;
  background-color: #fff;

  & li {
    display: flex;
    position: relative;
    line-height: 1rem;
    color: #333;
    font-size: 0.32rem;
    border-bottom: 1px solid #eee;

    &::after {
      content: "";
      width: 0.3rem;
      height: 0.3rem;
      position: absolute;
      top: 50%;
      right: 0.3rem;
      border-top: 1px solid #999;
      border-right: 1px solid #999;
      transform: translateY(-50%) rotate(45deg);
    }
  }

  & li:last-child::after {
    display: none;
  }

  & span {
    margin-left: 0.52rem;
    font-size: 0.3rem;
  }

  & .no-selected {
    color: #a5a5a5;
  }

  & input {
    flex: 1;
    width: 100%;
    margin-left: 0.52rem;
    font-size: 0.3rem;
    border: none;
  }

  & input::placeholder {
    color: #a5a5a5;
  }
}

.view-btn {
  width: 7.5rem;
  position: fixed;
  left: 50%;
  bottom: 0;
  font-size: 0.32rem;
  line-height: 1rem;
  background: linear-gradient(to right, #00c3cc, #05d0ca);
  transform: translateX(-50%);
}
</style>

<template>
	<div class="profile">
		<p class="warning">测试结果会因性别、年龄不同而不同！</p>

		<ul class="profile-list">
			<li @click="sexModalStatus = true">
				你的性别
				<span :class="{'no-selected': ! sex}">{{sex | format}}</span>
			</li>
			<li @click="openDatePicker">
				出生日期
				<input type="text" readonly placeholder="请输入生日 格式 1991-12-18" v-model="birthday">
			</li>
			<mt-datetime-picker ref="picker" type="date" :startDate="new Date(1950,0,1)" @confirm="handleConfirm">
			</mt-datetime-picker>
		</ul>

		<div class="btn view-btn" @click="check">查看结果</div>

		<transition name="modal">
			<div class="modal" v-if="sexModalStatus" @click="sexModalStatus = false" @touchmove.prevent>
				<ul class="modal-list">
					<li>选择性别</li>
					<li @click="selectItem(1)">男</li>
					<li @click="selectItem(2)">女</li>
				</ul>
			</div>
		</transition>
	</div>
</template>

<script>
import Vue from "vue";
import { getResponse, getResponses } from "api";
import { DatetimePicker } from "mint-ui";
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
  props: ["arr"],
  data() {
    return {
      birthday: "1950-01-01",

      sex: 0,
      sexModalStatus: false
    };
  },
  filters: {
    format(value) {
      return ["请选择", "男", "女"][value];
    }
  },
  methods: {
    selectItem(value) {
      this.sex = value;
    },
    openDatePicker() {
      this.$refs.picker.open();
    },
    handleConfirm(value) {
      var year, mount, day;
      year = new Date(value).getFullYear();
      mount = new Date(value).getMonth() + 1;
      day = new Date(value).getDate();
      mount = mount >= 10 ? mount : "0" + mount;
      day = day >= 10 ? day : "0" + day;
      this.birthday = year + "-" + mount + "-" + day;
      this.$refs.picker.close();
    },
    check() {
      const re = /(\d{4})-(\d{1,2})-(\d{1,2})/;
      if (!this.sex) {
        this.$toast("请选择性别");
        return;
      }

      if (!re.test(this.birthday)) {
        this.$toast("请输入正确的生日格式");
        return;
      }

      let open = false;

      this.birthday.replace(re, (match, year, month, day) => {
        if (year < 1900) {
          this.$toast("年份太少");
          open = true;
          return;
        }

        if (year > new Date().getFullYear()) {
          this.$toast("年份太大");
          open = true;
          return;
        }

        if (month > 12) {
          this.$toast("月份不能大于 12");
          open = true;
          return;
        }

        if (day > 31) {
          this.$toast("日期不能大于 31");
          open = true;
        }
      });

      if (open) {
        return;
      }

      this.submit();
    },
    async submit() {
      const params = {
        birthday: this.birthday.replace(/-/g, "/"),
        relateTestScaleId: this.$route.params.id,
        sex: this.sex === 1 ? "man" : "woman",
        // telephone: this.$root.user.phone === null ? "" : this.$root.user.phone,
        tsotListStr: JSON.stringify(this.arr),
        userId: this.$root.user.uid,
        userName: this.$root.user.nickname
      };

      if (this.$root.user) {
        //params.telephone = this.$root.user.phone
        params.userId = this.$root.user.uid;
        params.userName = this.$root.user.nickname;

        if (this.$root.user.phone) {
          params.telephone = this.$root.user.phone;
        }
      }

      //try {
      const data = await getResponse(
        "orderCenter/testScaleOrder/completeTest",
        params
      );

      if (data.code === 0) {
        this.$router.push(`/result/${data.testScaleOrderId}`);
        return;
      }

      this.$toast(data.msg || data.message);
      // } catch (e) {
      // 	this.$toast(e.msg || data.message)
      // }
    }
  }
};
</script>
