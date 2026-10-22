<template>
	<div>
		<el-backtop>
			<div class="go-top">
				<el-icon class="el-icon-top"><top /></el-icon>
				<p>顶部</p>
			</div>
		</el-backtop>
	</div>
</template>

<script setup>
import { Top } from "@element-plus/icons-vue"

</script>

<style lang="less" scoped>
.el-backtop{
	z-index: 111;
}
.go-top {
	height: 100%;
	width: 100%;
	background-color: #f2f5f6;
	box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
	display: flex;
	align-items: center;
	flex-flow: column wrap;
	justify-content: center;
	i {
		font-size: 16px;
	}
	p {
		font-size: 12px;
	}
}
</style>